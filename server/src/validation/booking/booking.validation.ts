import z from 'zod';
import profileValidation from '../profile/profile.validation.js';
import { BookingStatus, DeliveryType } from '@prisma/client';

const createBookingSchema = z.object({
    email: z.email().optional(),
    profileId: z.uuid(),
    address: profileValidation.tempProfileSchema.optional(),
    deliveryType: z.enum(DeliveryType),
    serviceId: z.uuid(),
    scheduledDate: z.coerce.date().optional(),
    pickupTime: z.string().optional(),
    weight: z.float64().optional(),
    itemCount: z.number().optional(),
    additionalNotes: z.string().optional(),
});

export type CreateBookingSchema = z.infer<typeof createBookingSchema>

const updateBookingSchema = createBookingSchema.partial();

export type UpdateBookingSchema = z.infer<typeof updateBookingSchema>

const updateBookingStatusSchema = z.object({
    status: z.enum(BookingStatus)
});

export type UpdateBookingStatusSchema = z.infer<typeof updateBookingStatusSchema>

export default {
    createBookingSchema,
    updateBookingSchema,
    updateBookingStatusSchema
};
