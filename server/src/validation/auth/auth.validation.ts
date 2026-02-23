import z from 'zod';
import { UserType, CompanyRoleTitle } from '@prisma/client';

const profileSchema = z.object({
    phoneNumber: z.string().nullable(),
    addressLine1: z.string().nullable(),
    addressLine2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    postalCode: z.string().nullable(),
    paymentMethodToken: z.string().nullable(),
}).nullable();

export type ProfileSchema = z.infer<typeof profileSchema>

const userSchema = z.object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    email: z.email(),
    password: z.string(),
    type: z.enum(Object.values(UserType)),
    role: z.enum(Object.values(CompanyRoleTitle)).nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable().optional(),
    tokens: z.array(z.any()),
    profile: profileSchema.optional(),
    notifications: z.array(z.any()),
});

export type UserSchema = z.infer<typeof userSchema>

const signupSchema = z.object({
  email: z.email('Email is invalid'),
  password: z.string()
    .min(7, { message: 'Password must be a minimum of 7 letters' })
    .refine((val) => /^[A-Z]/.test(val), { message: 'First letter must be uppercase' })
    .refine((val) => /[!@#$%^&*]/.test(val), { message: 'Must contain at least one special character' }),
  type: z.enum(Object.values(UserType)),
  role: z.enum(Object.values(CompanyRoleTitle)).nullable().optional(),
  profile: profileSchema.optional(),
});

const signupSchemaWithRules = signupSchema.superRefine((data, ctx) => {
  if (data.type === 'CLIENT' && data.role) {
    ctx.addIssue({
      code: 'custom',
      message: 'CLIENT users cannot have a company role',
    });
  }
});


export type SignupSchema = z.infer<typeof signupSchemaWithRules>

const loginSchema = signupSchema.pick({
    email: true,
    password: true
});

export type LoginSchema = z.infer<typeof loginSchema>

const forgotPasswordSchema = z.object({
    email: z.email()
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(7),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

const changePasswordSchema = z.object({
  currentPassword: z.string().min(7),
  newPassword: z.string().min(7),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>


export default {
  profileSchema,
  userSchema,
  signupSchema: signupSchemaWithRules,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
