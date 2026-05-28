import z from 'zod';
import paymentValidation from './payment.validation.js';
import { PaymentStatus } from '@prisma/client';

const updatePaymentFromWebhookSchema = z.object({
  status: z.enum(PaymentStatus),
  providerRef: z.string(),
  paidAt: z.coerce.date().optional(),
  channel: z.string().optional(),
});

export type UpdatePaymentFromWebhookSchema = z.infer<typeof updatePaymentFromWebhookSchema>

const handleWebhookSchema = paymentValidation.createPaymentEventSchema.extend({
    paymentUpdate: updatePaymentFromWebhookSchema,
});
export type HandleWebhookSchema = z.infer<typeof handleWebhookSchema>

export default {
    handleWebhookSchema,
    updatePaymentFromWebhookSchema
};