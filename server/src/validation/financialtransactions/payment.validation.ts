import z from 'zod';
import { PaymentProvider, PaymentStatus, Currency } from '@prisma/client';
import transactionsValidation from './transactions.validation.js';

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

export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>

const initiatePaymentSchema = createPaymentSchema.extend({
    ...transactionsValidation.createtransactionSchema.shape
});

export type InitiatePaymentSchema = z.infer<typeof initiatePaymentSchema>

const createPaymentEventSchema = z.object({
    paymentId: z.uuid().optional(),
    provider: z.enum(PaymentProvider),
    eventType: z.string(),
    providerRef: z.string().optional(),
    payload: z.record(z.string(), z.any()),
    signature: z.string().optional()
});

export type CreatePaymentEventSchema = z.infer<typeof createPaymentEventSchema>

export default {
    createPaymentSchema,
    updatePaymentSchema,
    initiatePaymentSchema,
    createPaymentEventSchema
};