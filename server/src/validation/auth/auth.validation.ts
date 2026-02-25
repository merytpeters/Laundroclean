import z from 'zod';
import { UserType, CompanyRoleTitle } from '@prisma/client';

const signupSchema = z.object({
  name: z.string().optional(),
  email: z.email('Email is invalid'),
  password: z.string()
    .min(7, { message: 'Password must be a minimum of 7 letters' })
    .refine((val) => /^[A-Z]/.test(val), { message: 'First letter must be uppercase' })
    .refine((val) => /[!@#$%^&*]/.test(val), { message: 'Must contain at least one special character' }),
  type: z.enum(Object.values(UserType)),
  role: z.enum(Object.values(CompanyRoleTitle)).nullable().optional(),
}).transform((data) => {
  if (!data.name) return { ...data };

  const parts = data.name.trim().split(' ');

  return {
    ...data,
    firstName: parts[0],
    lastName: parts.slice(1).join(' ') || null,
  };
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

const loginSchema = z.object({
  email: z.email('Email is invalid'),
  password: z.string()
    .min(7, { message: 'Password must be a minimum of 7 letters' })
    .refine((val) => /^[A-Z]/.test(val), { message: 'First letter must be uppercase' })
    .refine((val) => /[!@#$%^&*]/.test(val), { message: 'Must contain at least one special character' }),
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
  signupSchema: signupSchemaWithRules,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
