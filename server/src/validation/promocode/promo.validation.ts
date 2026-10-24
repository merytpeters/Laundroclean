import z from 'zod';

const promoCreate = z.object({
  code: z.string().min(3).transform(s => s.toUpperCase()),
  description: z.string().optional(),
  serviceId: z.uuid(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().nonnegative(),
  currency: z.enum(['DOLLAR', 'NAIRA', 'POUNDS']).optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional(),
}).refine(
    (data) =>
        data.expiresAt === undefined ||
        data.startsAt === undefined ||
        data.expiresAt > data.startsAt,
    {
        message: 'Expiry date must be after the start date',
        path: ['expiresAt'],
    }
);

const promoUpdate = z.object({
  code: z.string().min(3).transform(s => s.toUpperCase()).optional(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
  value: z.number().nonnegative(),
  currency: z.enum(['DOLLAR', 'NAIRA', 'POUNDS']).optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
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
