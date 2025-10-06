import z from 'zod';
import { UserType, CompanyRoleTitle } from '@prisma/client';

const profileSchema = z.object({
    id: z.uuid(),
    user_id: z.uuid(),
    phone_number: z.string().nullable().optional(),
    address_line_1: z.string().nullable().optional(),
    address_line_2: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    postal_code: z.string().nullable().optional(),
    payment_method_token: z.string().nullable().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date().nullable().optional(),
}).partial()

export type ProfileSchema = z.infer<typeof profileSchema>

const userSchema = z.object({
    id: z.uuid(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    email: z.email(),
    password: z.string(),
    type: z.enum(Object.values(UserType)),
    role: z.enum(Object.values(CompanyRoleTitle)).nullable().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date().nullable().optional(),
    tokens: z.array(z.any()),
    profile: profileSchema.optional(),
    notifications: z.array(z.any()),
})

export type UserSchema = z.infer<typeof userSchema>

const signupSchema = z.object({
  email: z.email("Email is invalid"),
  password: z.string()
      .min(7, { message: "Password must be a minimum of 7 letters" })
      .refine((val) => /^[A-Z]/.test(val), { message: "First letter must be uppercase" })
      .refine((val) => /[!@#$%^&*]/.test(val), { message: "Must contain at least one special character" }),
  profile: profileSchema.partial().optional(),
})

export type SignupSchema = z.infer<typeof signupSchema>

const loginSchema = signupSchema.pick({
    email: true,
    password: true
})

export type LoginSchema = z.infer<typeof loginSchema>

const forgotPasswordSchema = z.object({
    email: z.email()
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

const resetPasswordSchema = z.object({
  email: z.email(),
  password: z.string().min(7),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

const changePasswordSchema = z.object({
  currentPassword: z.string().min(7),
  newPassword: z.string().min(7),
})

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>


export default {
    profileSchema,
    userSchema,
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
}
