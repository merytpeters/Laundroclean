import prisma from '../../../config/prisma.js';
import type { Prisma, Transaction, Payment, PaymentEvent } from '@prisma/client';
import { TransactionValidation, PaymentValidation } from '../../../validation/index.js';
import type { CreateTransactionSchema } from '../../../validation/financialtransactions/transactions.validation.js';
import type { CreatePaymentSchema, InitiatePaymentSchema, CreatePaymentEventSchema, UpdatePaymentSchema } from '../../../validation/financialtransactions/payment.validation.js';
import type { HandleWebhookSchema, UpdatePaymentFromWebhookSchema } from '../../../validation/financialtransactions/webhook.validation.js';
import { NotFoundError } from '../../../middlewares/errorHandler.js';
import { PaymentUtils } from '../index.js';
import { PaymentStatus, TransactionStatus } from '@prisma/client';


type TransactionCreateInput = Prisma.TransactionCreateInput;
type TransactionWhereUniqueInput = Prisma.TransactionWhereUniqueInput;
type PaymentCreateInput = Prisma.PaymentCreateInput;
type PaymentEventCreateInput = Prisma.PaymentEventCreateInput
type PaymentUpdateInput = Prisma.PaymentUpdateInput

const paymentToTransactionMap: Record<PaymentStatus, TransactionStatus | null> = {
  INITIATED: TransactionStatus.PENDING,
  PENDING: TransactionStatus.PENDING,
  SUCCESS: TransactionStatus.SUCCESS,
  FAILED: TransactionStatus.FAILED,
  REVERSED: TransactionStatus.REFUNDED,
  EXPIRED: TransactionStatus.CANCELLED,
  ABANDONED: TransactionStatus.CANCELLED,
  REFUNDED: TransactionStatus.REFUNDED,
};

class PaymentsService {

  async initiatePayment(payload: InitiatePaymentSchema) {
    return await prisma.$transaction(async (tx) => {
      const existingTx = await tx.transaction.findFirst({
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
      const newTx = await this.createTransaction({
        bookingId: payload.bookingId,
        userId: payload.userId,
      });
      const { bookingId, userId, ...paymentPayload } = payload;
      const payment = await this.createPayment({
        ...paymentPayload,
        transactionId: newTx.id,
        amount: newTx.paidAmount,
      }, { id: newTx.id });

      return payment;
   });
  }

  async handleWebhook(payload: HandleWebhookSchema) {
    const event = await this.createPaymentEvent({
      eventType: payload.eventType,
      provider: payload.provider,
      providerRef: payload.providerRef,
      payload: payload.payload,
      signature: payload.signature,
    });
    try {
      const updatedPayment = await this.updatePaymentStatus(
        payload.paymentUpdate
      );

      await prisma.paymentEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });

      return updatedPayment;

    } catch (err) {
      throw err;
    }
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

  private async syncTransaction(payment: Payment) {
    return await prisma.$transaction(async (tx) => {
      const fullPayment = await tx.payment.findUnique({
        where: { id: payment.id },
        include: {
          transaction: true,
        },
      });

      if (!fullPayment) return;

      const transactionStatus = paymentToTransactionMap[payment.status];

      if (!transactionStatus) return;

      const transactionId = fullPayment.transactionId;

      const updatedTransaction = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: transactionStatus,
          paidAt:
            transactionStatus === 'SUCCESS'
              ? fullPayment.paidAt ?? new Date()
              : fullPayment.paidAt ?? null,
        },
      });

      if (transactionStatus === 'SUCCESS') {
        await tx.booking.update({
          where: { id: fullPayment.transaction.bookingId },
          data: {
            status: 'CONFIRMED',
          },
        });
      }

      if (
        transactionStatus === 'FAILED' ||
        transactionStatus === 'CANCELLED'
      ) {
        await tx.booking.update({
          where: { id: fullPayment.transaction.bookingId },
          data: {
            status: 'PENDING',
          },
        });
      }

      if (
        transactionStatus === 'REFUNDED'
      ) {
        await tx.booking.update({
          where: { id: fullPayment.transaction.bookingId },
          data: {
            status: 'CANCELLED',
          },
        });
      }

      return updatedTransaction;
    });
  }

  private async applyPaymentUpdate(
    paymentId: string,
    data: PaymentUpdateInput
  ): Promise<Payment> {
    return await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data,
        include: {
          transaction: {
            include: {
              booking: true,
            },
          },
        },
      });
  }

  private async updatePaymentStatus(
    payload: UpdatePaymentFromWebhookSchema
  ): Promise<Payment> {

    return await prisma.$transaction(async (tx) => {

      const payment = await tx.payment.findFirst({
        where: {
          providerRef: payload.providerRef,
        },
        include: {
          transaction: {
            include: {
              booking: true,
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundError('Payment not found');
      }

      if (payment.status === 'SUCCESS') {
        return payment;
      }

      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: payload.status,
          ...(payload.paidAt !== undefined ? { paidAt: payload.paidAt } : {}),
          ...(payload.channel !== undefined ? { channel: payload.channel } : {}),
        },
      });

      await this.syncTransaction(updatedPayment);

      return updatedPayment;
    });
  }

  private async updatePaymentManually(
    paymentId: string,
    payload: UpdatePaymentSchema
  ): Promise<Payment> {

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    const paidAtValue =
      payload.status === 'SUCCESS'
        ? payload.paidAt ?? new Date()
        : payload.paidAt ?? undefined;

    const data: PaymentUpdateInput = {
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.providerRef !== undefined ? { providerRef: payload.providerRef } : {}),
      ...(paidAtValue !== undefined ? { paidAt: paidAtValue } : {}),
      ...(payload.channel !== undefined ? { channel: payload.channel } : {}),
    };

    const updatedPayment = await this.applyPaymentUpdate(payment.id, data as PaymentUpdateInput);

    await this.syncTransaction(updatedPayment);

    return updatedPayment;
  }

  

  
}

export default new PaymentsService();