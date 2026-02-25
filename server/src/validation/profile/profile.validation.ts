import z from 'zod';

const profileSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    addressLine1: z.string().nullable(),
    addressLine2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    postalCode: z.string().nullable(),
    paymentMethodToken: z.string().nullable(),
}).nullable();

export type ProfileSchema = z.infer<typeof profileSchema>

export default {
  profileSchema
};