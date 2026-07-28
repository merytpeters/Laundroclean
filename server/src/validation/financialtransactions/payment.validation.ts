import z from 'zod';
import { PaymentProvider, PaymentStatus, Currency } from '@prisma/client';
import { ZodIssueCode } from 'zod/v3';


const posDeviceUpdateSchema = z.object({
  name: z.string().optional(),
  serialNumber: z.string(),
  isActive: z.preprocess((val) => {
    if (val === 'true' || val === true) return true;
    if (val === 'false' || val === false) return false;
    return undefined;
  }, z.boolean().optional())
});

export type POSdeviceUpdateSchema = z.infer<typeof posDeviceUpdateSchema>

const posDeviceSchema = z.object({
  name: z.string().optional(),
  serialNumber: z.string(),
});

export type POSdeviceSchema = z.infer<typeof posDeviceSchema>

const userInfoSchema = z.object({
  customerName: z.string().optional(),
  UserPhone: z.string().optional(),
  email: z.email().optional(),
  userMobile: z.string().optional()
});

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Invalid card number'),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  cvv: z.string().min(3, 'Invalid CVV'),
  cardHolderName: z.string(),
});

const createPaymentSchema = z.object({
  provider: z.enum(PaymentProvider),
  status: z.enum(PaymentStatus),
  amount: z.number().int().positive(),
  channel: z.string().refine(
    (val) =>
      ['BANKCARD', 'BANK_TRANSFER', 'OPAY_WALLET', 'POS', 'CASH'].includes(val),
    {
      message: 'Invalid payment channel',
    }
  ),
  currency: z.enum(Object.values(Currency)),
  card: z.union([z.undefined(), cardSchema]) as z.ZodType<z.infer<typeof cardSchema> | undefined, z.ZodType, any>,
  userInfo: z.union([z.undefined(), userInfoSchema]) as z.ZodType<z.infer<typeof userInfoSchema> | undefined, z.ZodType, any>,
  sn: z.union([z.undefined(), posDeviceSchema]) as z.ZodType<z.infer<typeof posDeviceSchema> | undefined, z.ZodType, any>,
}).superRefine((data, ctx) => {
  if (data.channel === 'BANKCARD' && !data.card) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: 'Card details are required for card payment',
      path: ['card'],
    });
  }
});

const initializePaymentSchema = createPaymentSchema.extend({
  authorization: z.json().optional(),
  transactionId: z.uuid().optional(),
  providerRef: z.string().optional(),
});

export type InitializePaymentSchema = z.infer<typeof initializePaymentSchema>

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>

const updatePaymentSchema = z.object({
  status: z.enum(PaymentStatus).optional(),
  providerRef: z.string().optional(),
  paidAt: z.coerce.date().optional(),
  channel: z.string().optional(),
});

export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>

const initiatePaymentSchema = createPaymentSchema.extend({
  bookingId: z.uuid(),
  userId: z.uuid(),
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
  initializePaymentSchema,
  updatePaymentSchema,
  initiatePaymentSchema,
  createPaymentEventSchema,
  posDeviceSchema,
  posDeviceUpdateSchema
};