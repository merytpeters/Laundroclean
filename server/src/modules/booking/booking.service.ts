import prisma from '../../config/prisma.js';
import type { Prisma, Booking, User } from '@prisma/client';
import { PricingType } from '@prisma/client';
import { BookingUtils } from './index.js';
import { AuthUtils } from '../auth/index.js';
import { NotFoundError, ConflictError, UnauthorizedError, ForbiddenError } from '../../middlewares/errorHandler.js';
import type { CreateBookingSchema, UpdateBookingSchema, UpdateBookingStatusSchema } from '../../validation/booking/booking.validation.js';
import { ServicepriceService } from '../serviceprice/index.js';
import { PromoService, PromoUsageService } from '../promocode/index.js';
import { BookingTransitions } from './booking.transitions.js';
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
            if (input.deliveryType === 'PICK_UP') {
                const serviceArea = await validateServiceArea(tx, lat, lng);
                if (!serviceArea) {
                    const nearest = await BookingUtils.nearestDropOffPoint(lat, lng, tx);
                    throw new NotFoundError(
                        `Pickup not available in your area. Nearest drop-off point: ${nearest?.name || 'Not found'}. Change deliveryType to Drop off`
                    );
                }
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

        // 6. Apply promo (if any) and then retry booking creation
        for (let i = 0; i < 3; i++) {
            try {
                const customBookingId = await BookingUtils.generateCustomBookingId();
                const scheduledPickupDay = await BookingUtils.enforceMinPickup(input.scheduledDate ?? null, tx);

                // Enforce per-service daily booking limit (if set)
                const svc = await tx.service.findUnique({ where: { id: input.serviceId } });
                if (svc && svc.maxDailyBookings !== null && svc.maxDailyBookings !== undefined) {
                    const scheduled = scheduledPickupDay ?? new Date();
                    const dayStart = new Date(Date.UTC(scheduled.getUTCFullYear(), scheduled.getUTCMonth(), scheduled.getUTCDate(), 0, 0, 0));
                    const dayEnd = new Date(dayStart);
                    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

                    const existingCount = await tx.booking.count({
                        where: {
                            serviceId: input.serviceId,
                            scheduledDate: { gte: dayStart, lt: dayEnd },
                            status: { not: 'CANCELLED' }
                        }
                    });

                    if (existingCount >= svc.maxDailyBookings) {
                        throw new ConflictError('Daily booking limit reached for this service');
                    }
                }

                // Promo application: check provided promo code, calculate discount and adjust totals
                let promoCodeId: string | null = null;
                let discountAmount: any = null;
                let finalAmount: any = totalAmount;

                if ((input as any).promoCode) {
                    const promo = await PromoService.getPromoByCodeForService(input.serviceId, (input as any).promoCode);
                    if (!promo) {
                        throw new UnauthorizedError('Invalid or expired promo code');
                    }

                    // enforce overall usage limit
                    if (promo.usageLimit !== null && promo.timesUsed >= promo.usageLimit) {
                        throw new ConflictError('Promo usage limit reached');
                    }

                    // enforce per-user limit via PromoUsage
                    const usage = await tx.promoUsage.findFirst({ where: { promoCodeId: promo.id, userId: user.id} });
                    if (promo.perUserLimit !== null && (usage?.timesUsed ?? 0) >= promo.perUserLimit) {
                        throw new ConflictError('User promo code usage limit reached');
                    }

                    // Do not enforce or increment usage here; usage is applied when booking is CONFIRMED.
                    const calc = PromoService.calculateDiscount(Number(totalAmount), promo as any);
                    discountAmount = calc.discount;
                    finalAmount = calc.finalAmount;
                    promoCodeId = promo.id;
                }

                return await tx.booking.create({
                    data: {
                        profileId: input.profileId,
                        serviceId: input.serviceId,

                        deliveryType: input.deliveryType,
                        scheduledDate: scheduledPickupDay ?? null,
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
                        promoCodeId: promoCodeId,
                        discountAmount: discountAmount,
                        finalAmount: finalAmount,

                        status: 'PENDING',
                        customBookingId,
                        assignedToId: input.assignedToId ?? null,
                        timeSlotId: input.timeSlotId ?? null,
                    },
                    include: { assignedTo: true }
                });
            } catch (error: any) {
                if (error.code !== 'P2002') throw error;
            }
        }

        throw new ConflictError('Failed to generate unique booking ID');
    });
};

// for client and companyuser same approach as create
const updateBooking = async (input: UpdateBookingInput, where: BookingWhereUniqueInput | string): Promise<Booking> => {
    return await prisma.$transaction(async (tx) => {
        try {
            const whereObj = normalizeWhere(where);
            const booking = await tx.booking.findUnique({
                where: whereObj,
                include: {
                    profile: true,
                    assignedTo: true,
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

            // Promo application on update: if promoCode provided, validate and apply
            if ((input as any).promoCode) {
                const promo = await PromoService.getPromoByCodeForService(booking.serviceId, (input as any).promoCode);
                if (!promo) {
                    throw new UnauthorizedError('Invalid or expired promo code');
                }

                // enforce overall usage limit
                if (promo.usageLimit !== null && promo.timesUsed >= promo.usageLimit) {
                    throw new ConflictError('Promo usage limit reached');
                }

                // enforce per-user limit via PromoUsage
                const usage = await tx.promoUsage.findFirst({ where: { promoCodeId: promo.id, userId: booking.profile.userId } });
                if (promo.perUserLimit !== null && (usage?.timesUsed ?? 0) >= promo.perUserLimit) {
                    throw new ConflictError('User promo code usage limit reached');
                }

                const calc = PromoService.calculateDiscount(Number(totalAmount), promo as any);
                updateData.discountAmount = calc.discount as any;
                updateData.finalAmount = calc.finalAmount as any;
                updateData.promoCode = { connect: { id: promo.id } } as any;
            }
            
            if (input.address) {
                const addressLine = input.address.addressLine1 || input.address.addressLine2;
                if (!addressLine) {
                    throw new Error('At least one address line is required');
                }
                const { lat, lng } = await BookingUtils.geocodeAddress(addressLine);
                if (input.deliveryType === 'PICK_UP') {
                    const serviceArea = await validateServiceArea(tx, lat, lng);
                    if (!serviceArea) {
                        const nearest = await BookingUtils.nearestDropOffPoint(lat, lng, tx);
                        throw new NotFoundError(
                            `Pickup not available in your area. Nearest drop-off point: ${nearest?.name || 'Not found'}. Change deliveryType to Drop off`
                        );
                    }
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
            if (input.scheduledDate !== undefined) {
                const scheduledPickupDay = await BookingUtils.enforceMinPickup(input.scheduledDate ?? null, tx);
                updateData.scheduledDate = scheduledPickupDay;
            }
            if (input.additionalNotes !== undefined) updateData.additionalNote = input.additionalNotes;
            if (input.pickupTime !== undefined) updateData.pickupTime = input.pickupTime;
            if (input.itemCount !== undefined) updateData.itemCount = input.itemCount;
            if (input.assignedToId !== undefined) {
                if (input.assignedToId === null) {
                    updateData.assignedTo = { disconnect: true };
                } else {
                    updateData.assignedTo = { connect: { id: input.assignedToId } };
                }
            }
            if (input.timeSlotId !== undefined) {
                if (input.timeSlotId === null) {
                    updateData.timeSlot = { disconnect: true };
                } else {
                    updateData.timeSlot = {connect: { id: input.timeSlotId} };
                }
            }
            
            updateData.unitPrice = unitPrice;
            updateData.currency = price.currency;
            updateData.pricingType = price.pricingType;
            updateData.totalAmount = totalAmount;

            // Enforce per-service daily booking limit when changing service or scheduled date
            const targetServiceId = (input as any).serviceId ?? booking.serviceId;
            const targetScheduled = (input as any).scheduledDate !== undefined
                ? await BookingUtils.enforceMinPickup(input.scheduledDate ?? null, tx)
                : booking.scheduledDate;

            if (targetServiceId && targetScheduled) {
                const svc = await tx.service.findUnique({ where: { id: targetServiceId } });
                if (svc && svc.maxDailyBookings !== null && svc.maxDailyBookings !== undefined) {
                    const scheduled = targetScheduled as Date;
                    const dayStart = new Date(Date.UTC(scheduled.getUTCFullYear(), scheduled.getUTCMonth(), scheduled.getUTCDate(), 0, 0, 0));
                    const dayEnd = new Date(dayStart);
                    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

                    const existingCount = await tx.booking.count({
                        where: {
                            serviceId: targetServiceId,
                            scheduledDate: { gte: dayStart, lt: dayEnd },
                            status: { not: 'CANCELLED' },
                            id: { not: booking.id }
                        }
                    });

                    if (existingCount >= svc.maxDailyBookings) {
                        throw new ConflictError('Daily booking limit reached for this service');
                    }
                }
            }

            const updatedbooking = await tx.booking.update({
                where: whereObj,
                data: updateData,
                include: { assignedTo: true }
            });
            return updatedbooking;
        } catch (_error: any) {
            throw new NotFoundError('Booking not found');
        }
    });
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
        include: { 
            profile: true,
            assignedTo: true,
        },
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
        prisma.booking.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { assignedTo: true} }),
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
        if (!clientAllowedStatuses.includes(input.status) && input.status !== 'CONFIRMED') {
            throw new UnauthorizedError(
                `Clients may only update status to: ${clientAllowedStatuses.join(', ')} or CONFIRMED via payment`
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

    // Enforce allowed transitions
    const allowedNext = BookingTransitions[booking.status as keyof typeof BookingTransitions] || [];
    if (booking.status !== input.status && !allowedNext.includes(input.status as any)) {
        throw new UnauthorizedError(`Invalid status transition from ${booking.status} to ${input.status}`);
    }

    // Only admins may manually set a booking to CONFIRMED. Normal confirmation flow is handled by payment processing.
    if (input.status === 'CONFIRMED' && !isAdmin) {
        throw new UnauthorizedError('Only admin users can manually set booking status to CONFIRMED');
    }

    // If confirming and there is a promo snapshot, enforce limits and increment usage transactionally
    if (input.status === 'CONFIRMED') {
        return await prisma.$transaction(async (tx) => {
            // re-fetch booking under tx to ensure fresh data
            const b = await tx.booking.findUnique({ where: whereObj, include: { profile: true } });
            if (!b) throw new NotFoundError('Booking not found');

            // if booking has a promo attached, validate and increment usage now
            if (b.promoCodeId) {
                const promo = await tx.promoCode.findUnique({ where: { id: b.promoCodeId } });
                if (!promo) throw new NotFoundError('Promo not found');

                if (promo.usageLimit !== null && promo.timesUsed >= promo.usageLimit) {
                    throw new ConflictError('Promo usage limit reached');
                }

                const usage = await tx.promoUsage.findFirst({ where: { promoCodeId: promo.id, userId: b.profile.userId } });
                if (promo.perUserLimit !== null && (usage?.timesUsed ?? 0) >= promo.perUserLimit) {
                    throw new ConflictError('User promo code usage limit reached');
                }

                await tx.promoCode.update({ where: { id: promo.id }, data: { timesUsed: { increment: 1 } } });
                await PromoUsageService.incrementUsage(tx, b.profile.userId, promo.id);
            }

            const updateData: Prisma.BookingUpdateInput = { status: input.status };
            if (input.status === 'CANCELLED') updateData.deletedAt = new Date();

            const updated = await tx.booking.update({ where: whereObj, data: updateData });
            return updated;
        });
    }

    // For other allowed transitions, perform a simple update
    const updateData: Prisma.BookingUpdateInput = { status: input.status };
    if (input.status === 'CANCELLED') updateData.deletedAt = new Date();

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
interface BookingSettingsInput {
  minPickupDays: number;
}

const upsertBookingSettings = async (
  input: BookingSettingsInput
) => {
  if (typeof input.minPickupDays !== 'number' || input.minPickupDays < 0) {
    throw new Error('minPickupDays must be a positive number');
  }

  const settings = await prisma.bookingSettings.upsert({
    where: { id: 1 },
    update: { minPickupDays: input.minPickupDays },
    create: { id: 1, minPickupDays: input.minPickupDays },
  });

  return settings;
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
    upsertBookingSettings
};
