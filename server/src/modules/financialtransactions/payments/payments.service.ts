import prisma from '../../../config/prisma.js';
import type { Prisma, Transaction, Payment, PaymentEvent } from '@prisma/client';
import { TransactionValidation, PaymentValidation, WebhookValidation } from '../../../validation/index.js';
import type { CreateTransactionSchema } from '../../../validation/financialtransactions/transactions.validation.js';
import type { CreatePaymentSchema, InitiatePaymentSchema, CreatePaymentEventSchema } from '../../../validation/financialtransactions/payment.validation.js';
import type { HandleWebhookSchema } from '../../../validation/financialtransactions/webhook.validation.js';
import { NotFoundError } from '../../../middlewares/errorHandler.js';
import { PaymentUtils } from '../index.js';


type TransactionCreateInput = Prisma.TransactionCreateInput;
type TransactionWhereUniqueInput = Prisma.TransactionWhereUniqueInput;
type PaymentCreateInput = Prisma.PaymentCreateInput;
type PaymentEventCreateInput = Prisma.PaymentEventCreateInput

class PaymentsService {

  async initiatePayment(payload: InitiatePaymentSchema) {
    const existingTx = await prisma.transaction.findFirst({
      where: {
        bookingId: payload.bookingId,
        status: 'PENDING',
      },
      include: {
        payment: true,
      },
    });

    if (existingTx) {
      return existingTx.payment;
    }
    const tx = await this.createTransaction({
      bookingId: payload.bookingId,
      userId: payload.userId,
    });
    const { bookingId, userId, ...paymentPayload } = payload;
    const payment = await this.createPayment({
      ...paymentPayload,
      transactionId: tx.id,
      amount: tx.paidAmount,
    }, { id: tx.id });

    return payment;
  }

  async handleWebhook(payload: HandleWebhookSchema) {
    const { updatePaymentFromWebhookSchema, ...createPaymentEventSchema} = payload;
    const event = await this.createPaymentEvent(createPaymentEventSchema);
    await this.updatePaymentStatus(event);
    await this.syncTransaction(event);
  }

  async verifyWebhook(signature: string, body: any) {
    return true;
  }

  // PRIVATE METHODS

  private async createTransaction(payload: CreateTransactionSchema): Promise<Transaction> {
    return await prisma.$transaction(async (tx) => {
      const validatedData = TransactionValidation.createtransactionSchema.parse(payload);
      const booking = await tx.booking.findUnique({
        where: { id : validatedData.bookingId }
      });

      if (!booking) {
        throw new NotFoundError('Bokking not found!');
      }

      const existing = await tx.transaction.findFirst({
        where: {
          bookingId: validatedData.bookingId,
          status: 'PENDING',
        },
      });

      if (existing) return existing;
      const data: TransactionCreateInput = {
          booking: {
              connect: { id : booking.id}
          },
        userId: validatedData.userId,
        paidAmount: PaymentUtils.toMinorUnit(booking.totalAmount.toNumber()),
        transactionRef: PaymentUtils.generateTransactionRef(),
      };
      const created = await tx.transaction.create({ data });
      return created;
    });
    
  }

  private async createPayment(payload: CreatePaymentSchema, where: TransactionWhereUniqueInput): Promise<Payment> {
    return await prisma.$transaction(async (tx) => {
      const validatedData = PaymentValidation.createPaymentSchema.parse(payload);
      const transaction = await tx.transaction.findUnique({
        where
      });

      const transactionId = transaction?.id;
      if (!transactionId) {
        throw new NotFoundError('Transaction not found');
      }

      const existingPayment = await tx.payment.findUnique({
        where: {
          providerRef: validatedData.providerRef,
        },
      });

      if (existingPayment) return existingPayment;

      const data: PaymentCreateInput = {
        provider: validatedData.provider,
        providerRef: validatedData.providerRef,
        amount: validatedData.amount,
        transaction: {
          connect: { id: transactionId },
        },
      };

      return await tx.payment.create({ data });
    });
  }

  private async createPaymentEvent(
    payload: CreatePaymentEventSchema
  ): Promise<PaymentEvent> {

    const providerRef = payload.providerRef;
    const eventType = payload.eventType;

    return await prisma.$transaction(async (tx) => {

      try {
        const data: PaymentEventCreateInput = {
          provider: payload.provider,
          eventType,
          payload: payload,
          processed: false,
          ...(providerRef ? { providerRef } : {}),
          ...(payload.signature ? { signature: payload.signature } : {}),
        };

        const event = await tx.paymentEvent.create({ data });

        return event;
      } catch (error: any) {

        // 2. If duplicate (race condition / webhook retry), fetch existing
        const whereClause: any = { eventType };
        if (providerRef !== undefined) whereClause.providerRef = providerRef;

        const existing = await tx.paymentEvent.findFirst({
          where: whereClause,
        });

        if (existing) {
          return existing;
        }

        throw error;
      }
    });
  }

  private async updatePaymentStatus(event: any) {
    //update booking status when payment is successfull
  }

  private async syncTransaction(event: any) {}

  private async updatePayment() {}
}

export default new PaymentsService();