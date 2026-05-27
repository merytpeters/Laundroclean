import z from 'zod';
import { TransactionStatus } from '@prisma/client';

const createtransactionSchema = z.object({
    bookingId: z.uuid(),
    userId: z.uuid(),
});

export type CreateTransactionSchema = z.infer<typeof createtransactionSchema>

const updateTransactionSchema = z.object({
  status: z.enum(TransactionStatus).optional(),
  paidAt: z.date().optional(),
  providerRef: z.string().optional(),
});

export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>

export default {
    createtransactionSchema,
    updateTransactionSchema
};