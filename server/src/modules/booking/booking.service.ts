import prisma from '../../config/prisma.js';
import type { Prisma, Booking, User } from '@prisma/client';
import { PricingType } from '@prisma/client';
import { BookingUtils } from './index.js';
import { AuthUtils } from '../auth/index.js';
import { NotFoundError, ConflictError, UnauthorizedError, ForbiddenError } from '../../middlewares/errorHandler.js';
import type { CreateBookingSchema, UpdateBookingSchema, UpdateBookingStatusSchema } from '../../validation/booking/booking.validation.js';
import { ServicepriceService } from '../serviceprice/index.js';
import { getPagination } from '../common/pagination/paginate.js';

type CreateBookingInput = CreateBookingSchema;
type UpdateBookingInput = UpdateBookingSchema;
type UpdateBookingStatusInput = UpdateBookingStatusSchema;
type BookingWhereUniqueInput = Prisma.BookingWhereUniqueInput;

type QuantityInput = {
  pricingType: PricingType;
  weight?: number | undefined;
  itemCount?: number | undefined;
};

const PricingService = {
    computeQuantity(input: QuantityInput): number {
        const { pricingType, weight, itemCount } = input;

        switch (pricingType) {
            case PricingType.PER_KG:
                if (!weight) {
                    throw new Error('Weight is required for PER_KG pricing');
                }
                return weight;

            case PricingType.PER_ITEM:
                if (!itemCount) {
                    throw new Error('Item count is required for PER_ITEM pricing');
                }
                return itemCount;

            case PricingType.FLAT_RATE:
                return 1;

            default:
                throw new Error('Unsupported pricing type');
        }
    },
};

const validateServiceArea = async (tx: Prisma.TransactionClient, lat: number, lng: number) => {
    const area = await tx.serviceArea.findFirst({
        where: {
            isActive: true,
            latMin: { lte: lat },
            latMax: { gte: lat },
            lngMin: { lte: lng },
            lngMax: { gte: lng },
        },
    });

    if (!area) {
        throw new UnauthorizedError('Service not available in this area');
    }

    return area;
};


const createBooking = async (
  input: CreateBookingInput,
  email?: string
): Promise<Booking> => {
    return await prisma.$transaction(async (tx) => {
        let user: User | null = null;

        // 1. Resolve user
        if (email) {
            user = await tx.user.findUnique({ where: { email } });

            if (!user) {
                const password = await AuthUtils.hashPassword(
                    BookingUtils.randomPassword()
                );

                user = await tx.user.create({
                    data: {
                        email,
                        password,
                        type: 'CLIENT',
                    },
                });
            }
        } else {
            const tempEmail = BookingUtils.randomEmail();
            const password = await AuthUtils.hashPassword(
                BookingUtils.randomPassword()
            );

            user = await tx.user.create({
                data: {
                    email: tempEmail,
                    password,
                    type: 'CLIENT',
                },
            });
        }

        if (!user) {
            throw new NotFoundError('Failed to create or fetch a user');
        }

        // 2. Get price
        const price = await ServicepriceService.getServicePrice({
            serviceId: input.serviceId,
        });

        if (!price) {
            throw new NotFoundError('Service price not found');
        }

        // 3. Compute quantity (use pricing type from the price snapshot)
        const quantity = PricingService.computeQuantity({
            pricingType: price.pricingType,
            weight: input.weight,
            itemCount: input.itemCount,
        });

        // 4. Pricing
        const unitPrice = price.amount;
        const totalAmount = unitPrice.mul(quantity);

        // 5. Address
        let addressId: string | null = null;

        if (input.address) {
            const addressLine = input.address.addressLine1 || input.address.addressLine2;
            if (!addressLine) {
                throw new Error('At least one address line is required');
            }
            const { lat, lng } = await BookingUtils.geocodeAddress(addressLine);
            const serviceArea = await validateServiceArea(tx, lat, lng);
            if (!serviceArea) {
                const nearest = await BookingUtils.nearestDropOffPoint(lat, lng, tx);
                throw new UnauthorizedError(
                    `Pickup not available in your area. Nearest drop-off point: ${nearest?.name || 'Not found'}`
                );
            }
            const address = await tx.profile.create({
                data: {
                    ...Object.fromEntries(
                        Object.entries(input.address).filter(([_, v]) => v !== undefined)
                    ),
                    userId: user.id,
                    isTemp: input.address.isTemp ?? false,
                },
            });

            addressId = address.id;
        }

        // 6. Retry booking creation
        for (let i = 0; i < 3; i++) {
            try {
                const customBookingId = await BookingUtils.generateCustomBookingId();

                return await tx.booking.create({
                    data: {
                        profileId: input.profileId,
                        serviceId: input.serviceId,

                        deliveryType: input.deliveryType,
                        scheduledDate: input.scheduledDate ?? null,
                        pickupTime: input.pickupTime ?? null,

                        weight: input.weight ?? null,
                        itemCount: input.itemCount ?? null,
                        additionalNote: input.additionalNotes ?? null,

                        addressId,

                        // pricing snapshot
                        unitPrice,
                        currency: price.currency,
                        pricingType: price.pricingType,
                        totalAmount,

                        status: 'PENDING',
                        customBookingId,
                    },
                });
            } catch (error: any) {
                if (error.code !== 'P2002') throw error;
            }
        }

        throw new ConflictError('Failed to generate unique booking ID');
    });
};

// for client and companyuser same approach as create
const updateBooking = async (input: UpdateBookingInput, where: BookingWhereUniqueInput): Promise<Booking> => {
    try{
        const booking = await prisma.booking.findUnique({
            where,
            include: {
                profile: true
            }
        });

        if (!booking) {
            throw new NotFoundError('Booking not found');
        }

        const price = await ServicepriceService.getServicePrice({
            serviceId: booking?.serviceId,
        });

        if (!price) {
            throw new NotFoundError('Service price not found');
        }

        // 3. Compute quantity (use pricing type from the price snapshot)
        const quantity = PricingService.computeQuantity({
            pricingType: price.pricingType,
            weight: input.weight,
            itemCount: input.itemCount,
        });

        // 4. Pricing
        const unitPrice = price.amount;
        const totalAmount = unitPrice.mul(quantity);

        const updateData: Prisma.BookingUpdateInput = {};
        
        if (input.address) {
            const addressLine = input.address.addressLine1 || input.address.addressLine2;
            if (!addressLine) {
                throw new Error('At least one address line is required');
            }
            const { lat, lng } = await BookingUtils.geocodeAddress(addressLine);
            const serviceArea = await validateServiceArea(prisma, lat, lng);
            if (!serviceArea) {
                const nearest = await BookingUtils.nearestDropOffPoint(lat, lng, prisma);
                throw new UnauthorizedError(
                    `Pickup not available in your area. Nearest drop-off point: ${nearest?.name || 'Not found'}`
                );
            }
            updateData.address = {
                update: {
                    ...Object.fromEntries(
                        Object.entries(input.address).filter(([_, v]) => v !== undefined)
                    ),
                    userId: booking.profile.userId,
                },
            };
        }
        
        if (input.deliveryType !== undefined) updateData.deliveryType = input.deliveryType;
        if (input.scheduledDate !== undefined) updateData.scheduledDate = input.scheduledDate;
        if (input.additionalNotes !== undefined) updateData.additionalNote = input.additionalNotes;
        if (input.pickupTime !== undefined) updateData.pickupTime = input.pickupTime;
        if (input.itemCount !== undefined) updateData.itemCount = input.itemCount;
        
        updateData.unitPrice = unitPrice;
        updateData.currency = price.currency;
        updateData.pricingType = price.pricingType;
        updateData.totalAmount = totalAmount;

        const updatedbooking = await prisma.booking.update({
            where,
            data: updateData
        });
        return updatedbooking;
    } catch (_error: any) {
        throw new NotFoundError('Booking not found');
    }
};

const normalizeWhere = (where: any): BookingWhereUniqueInput => {
    if (!where) return {} as BookingWhereUniqueInput;
    if (typeof where === 'string') return { id: where } as BookingWhereUniqueInput;
    return where as BookingWhereUniqueInput;
};

const getBooking = async (
    where: BookingWhereUniqueInput | string,
    currentUser?: { id?: string; type?: string },
    isAdmin: boolean = false
): Promise<Booking> => {
    const whereObj = normalizeWhere(where);

    const booking = await prisma.booking.findUnique({
        where: whereObj,
        include: { profile: true },
    });

    if (!booking) throw new NotFoundError('Booking not found');

    // If booking is soft-deleted, only admin may access it
    if (booking.deletedAt && !isAdmin) {
        throw new NotFoundError('Booking not found');
    }

    // If requester is a client, ensure they own the booking
    if (currentUser?.type === 'CLIENT') {
        if (!booking.profile || booking.profile.userId !== currentUser.id) {
            throw new ForbiddenError('Access denied: booking does not belong to the client');
        }
    }

    return booking;
};

const listBookings = async (
    params: { page?: number; limit?: number; status?: string; search?: string; profileId?: string } = {},
    currentUser?: { id?: string; type?: string },
    isAdmin: boolean = false
) => {
    const paginationInput: Record<string, any> = {};
    if (params.page !== undefined) paginationInput.page = params.page;
    if (params.limit !== undefined) paginationInput.limit = params.limit;
    if (params.search !== undefined) paginationInput.search = params.search;
    
    const { page, limit, skip } = getPagination(paginationInput);

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.search) {
        where.OR = [
            { customBookingId: { contains: params.search } },
        ];
    }

    // Exclude soft-deleted bookings for non-admins
    if (!isAdmin) {
        where.deletedAt = null;
    }

    // If requester is a client, restrict to their bookings only
    if (currentUser?.type === 'CLIENT') {
        where.profile = { userId: currentUser.id };
    }

    const [total, data] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
    };
};

const updateBookingStatus = async (
    input: UpdateBookingStatusInput,
    where: BookingWhereUniqueInput | string,
    isAdmin: boolean = false,
    currentUser?: { id?: string; type?: string }
): Promise<Booking> => {
    const whereObj = normalizeWhere(where);

    const booking = await prisma.booking.findUnique({ where: whereObj, include: { profile: true } });
    if (!booking) throw new NotFoundError('Booking not found');

    // If requester is a client, ensure they own the booking
    if (currentUser?.type === 'CLIENT') {
        if (!booking.profile || booking.profile.userId !== currentUser.id) {
            throw new ForbiddenError('Access denied: booking does not belong to the client');
        }
    }

    // Only admins may manually set a booking to CONFIRMED. Normal confirmation flow is handled by payment processing.
    if (input.status === 'CONFIRMED' && !isAdmin) {
        throw new UnauthorizedError('Only admin users can manually set booking status to CONFIRMED');
    }

    // Clients may only set customer-specific pickup/dropoff statuses.
    const clientAllowedStatuses = [
        'CUSTOMER_DROPPED_OFF_AT_POINT',
        'CUSTOMER_PICKED_UP_FROM_POINT',
    ];

    if (currentUser?.type === 'CLIENT') {
        if (!clientAllowedStatuses.includes(input.status)) {
            throw new UnauthorizedError(
                `Clients may only update status to: ${clientAllowedStatuses.join(', ')}`
            );
        }
    }

    // Non-admin staff/company users cannot set customer-specific statuses.
    if (!isAdmin && currentUser?.type === 'COMPANYUSER') {
        if (clientAllowedStatuses.includes(input.status)) {
            throw new UnauthorizedError('Only admin users can set customer-specific pickup/dropoff statuses');
        }
    }

    // For non-admin users (clients or staff), customer-specific statuses are only valid for DROP_OFF deliveries
    if (clientAllowedStatuses.includes(input.status) && !isAdmin) {
        if (booking.deliveryType !== 'DROP_OFF') {
            throw new UnauthorizedError('Customer pickup/dropoff statuses are only available for DROP_OFF delivery type');
        }
    }

    const updateData: Prisma.BookingUpdateInput = { status: input.status };
    if (input.status === 'CANCELLED') {
        updateData.deletedAt = new Date();
    }

    const updated = await prisma.booking.update({ where: whereObj, data: updateData });
    return updated;
};

const softDeleteBooking = async (where: BookingWhereUniqueInput | string, isAdmin: boolean = false): Promise<void> => {
    const whereObj = normalizeWhere(where);

    const booking = await prisma.booking.findUnique({ where: whereObj });
    if (!booking) throw new NotFoundError('Booking not found');

    // Clients can only cancel when booking status is PENDING or COMPLETED
    if (!isAdmin) {
        const allowed = ['PENDING', 'COMPLETED'];
        if (!allowed.includes(booking.status)) {
            throw new ForbiddenError('Clients may only cancel bookings in PENDING or COMPLETED status');
        }
    }

    // mark as cancelled and set deletedAt
    await prisma.booking.update({ where: whereObj, data: { status: 'CANCELLED', deletedAt: new Date() } as any });
};

const restoreBooking = async (where: BookingWhereUniqueInput | string, isAdmin: boolean = false): Promise<Booking> => {
    if (!isAdmin) {
        throw new UnauthorizedError('Only admin users can restore bookings');
    }

    const whereObj = normalizeWhere(where);

    const booking = await prisma.booking.findUnique({ where: whereObj });
    if (!booking) throw new NotFoundError('Booking not found');

    // restore: clear deletedAt, set isActive true and if previously cancelled, move back to PENDING
    const newStatus = booking.status === 'CANCELLED' ? 'PENDING' : booking.status;

    const updated = await prisma.booking.update({
        where: whereObj,
        data: {
            deletedAt: null,
            isActive: true,
            status: newStatus,
        } as any,
    });

    return updated;
};


// payment triggers status to confirmed
// const confirmBooking

export default {
    createBooking,
    updateBooking,
    getBooking,
    listBookings,
    updateBookingStatus,
    softDeleteBooking,
    restoreBooking,
};
