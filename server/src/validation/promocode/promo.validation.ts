import z from 'zod';

const promoCreate = z.object({
  code: z.string().min(3).transform(s => s.toUpperCase()),
  description: z.string().optional(),
  serviceId: z.uuid(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.union([z.number().nonnegative(), z.string()]),
  currency: z.enum(['DOLLAR','NAIRA','POUNDS']).optional(),
  isActive: z.boolean().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional(),
});

const promoUpdate = z.object({
  code: z.string().min(3).transform(s => s.toUpperCase()).optional(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
  value: z.union([z.number().nonnegative(), z.string()]).optional(),
  currency: z.enum(['DOLLAR','NAIRA','POUNDS']).optional(),
  isActive: z.boolean().optional(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  perUserLimit: z.number().int().positive().optional().nullable(),
});

const promoCheck = z.object({
  serviceId: z.uuid(),
  code: z.string().min(1),
  totalAmount: z.preprocess((v) => v === undefined ? undefined : Number(v), z.number().nonnegative().optional()),
});

export default {
  promoCreate,
  promoUpdate,
  promoCheck,
};
