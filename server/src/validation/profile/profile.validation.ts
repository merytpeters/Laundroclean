import z from 'zod';

const baseProfileSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postalCode: z.string().nullable(),
  paymentMethodToken: z.string().nullable(),
});

const profileSchema = baseProfileSchema.partial();

export type ProfileSchema = z.infer<typeof profileSchema>

const changePasswordSchema = z.object({
  currentPassword: z.string().min(7),
  newPassword: z.string().min(7),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

const profilePicSchema = z.object({
  avatarUrl: z.string(),
  avatarPublicId: z.string()
});

export type ProfilePicSchema = z.infer<typeof profilePicSchema>

export default {
  profileSchema,
  changePasswordSchema,
  profilePicSchema
};