import z from 'zod';
import { PaymentProvider, PaymentStatus, Currency } from '@prisma/client';

const createPaymentSchema = z.object({
    transactionId: z.uuid(),
    provider: z.enum(PaymentProvider),
    providerRef: z.string(),
    status: z.enum(PaymentStatus),
    amount: z.number().int().positive(),
    channel: z.string().optional(),
    currency: z.enum(Object.values(Currency)),
    authorization: z.json().optional(),
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>

const updatePaymentSchema = z.object({
  status: z.enum(PaymentStatus).optional(),
  providerRef: z.string().optional(),
  paidAt: z.coerce.date().optional(),
  channel: z.string().optional(),
});

export default {
    createPaymentSchema,
    updatePaymentSchema
};