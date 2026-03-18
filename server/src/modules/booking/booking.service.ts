import prisma from '../../config/prisma.js';
import type { Booking, User } from '@prisma/client';
import { PricingType } from '@prisma/client';
import { BookingUtils } from './index.js';
import { AuthUtils } from '../auth/index.js';
import { NotFoundError, ConflictError } from '../../middlewares/errorHandler.js';
import type { CreateBookingSchema } from '../../validation/booking/booking.validation.js';
import { ServicepriceService } from '../serviceprice/index.js';

type CreateBookingInput = CreateBookingSchema;

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
                const customBookingId =
                await BookingUtils.generateCustomBookingId();

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


export default {
    createBooking
};
