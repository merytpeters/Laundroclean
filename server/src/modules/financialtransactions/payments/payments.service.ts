import prisma from '../../../config/prisma.js';
import type { Prisma, Payment, PaymentEvent } from '@prisma/client';
import { PaymentValidation } from '../../../validation/index.js';
import type { InitializePaymentSchema, InitiatePaymentSchema, CreatePaymentEventSchema, UpdatePaymentSchema } from '../../../validation/financialtransactions/payment.validation.js';
import type { UpdatePaymentFromWebhookSchema } from '../../../validation/financialtransactions/webhook.validation.js';
import { NotFoundError, ServiceUnavailableError } from '../../../middlewares/errorHandler.js';
import { TransactionService } from '../transaction/transaction.service.js';
import { OpayService } from '../paymentProviders/opay.service.js';
import config from '../../../config/config.js';
import { ProfileService } from '../../common/index.js';
import { BookingService } from '../../booking/index.js';
import { PrismaClient, PaymentStatus } from '@prisma/client';


type TransactionWhereUniqueInput = Prisma.TransactionWhereUniqueInput;
type PaymentCreateInput = Prisma.PaymentCreateInput;
type PaymentEventCreateInput = Prisma.PaymentEventCreateInput
type PaymentUpdateInput = Prisma.PaymentUpdateInput;

const WEBHOOK_URL = config.WEBHOOK_URL;
const PAYMENT_REDIRECT_URL = config.PAYMENT_REDIRECT_URL;

const opayService = new OpayService();
const availablePaymentProvders = ['OPAY'];

export class PaymentService {

  constructor(
    private readonly transactionService: TransactionService,
  ) { }

  async initiatePayment(payload: InitiatePaymentSchema) {
    return await prisma.$transaction(async (tx) => {
      const Tx = await this.transactionService.createTransaction({
        bookingId: payload.bookingId,
        userId: payload.userId,
      }, tx);

      const provider = payload.provider.toLowerCase();
      const providerExists = availablePaymentProvders.some(p => p.toLowerCase() === provider);

      if (!providerExists) return { message: 'More payment provider will be added soon!, please choose another provider' };

      const { bookingId, userId, ...paymentPayload } = payload;
      const profile = await ProfileService.getActiveProfile({ userId });
      const name = `${profile?.user.firstName} ${profile?.user.lastName}`;

      const booking = await BookingService.getBooking({ id: bookingId });

      let providerRef: string | undefined;
      let paymentStatus = payload.status;

      if (payload.provider === 'OPAY') {
        try {

          let opayResponse = await opayService.initializePayment({
            amount: {
              currency: paymentPayload.currency,
              total: paymentPayload.amount,
            },
            callbackUrl: WEBHOOK_URL,
            country: 'NG',
            product: {
              description: booking.service.description,
              name: booking.service.name
            },
            reference: Tx.transactionRef,
            payMethod: paymentPayload.channel,
            bankcard: {
              enable3DS: true,
              ...paymentPayload.card
            },
            returnUrl: PAYMENT_REDIRECT_URL,
            customerName: paymentPayload.userInfo?.customerName || name,
            userPhone: paymentPayload.userInfo?.userPhone || profile?.phoneNumber,
            sn: paymentPayload?.sn.serialNumber,
            userInfo: {
              userEmail: paymentPayload.userInfo?.email || profile?.user.email,
              userId: userId,
              userName: paymentPayload.userInfo?.customerName || name,
              userMobile: paymentPayload.userInfo?.userMobile || profile?.phoneNumber
            },
          });

          if (opayResponse.data.message === 'SUCCESSFUL' && opayResponse.data !== null) {
            providerRef = opayResponse.data.data?.reference;
            paymentStatus = this.mapPaymentStatus(opayResponse.data.data.status);
          }

        } catch {
          throw new ServiceUnavailableError('Unable to initialize payment.');
        }

      }

      if (!providerRef) {
        throw new ServiceUnavailableError(
          'Unable to initialize payment.'
        );
      }

      const payment = await this.createPayment({
        ...paymentPayload,
        status: paymentStatus,
        providerRef,
        transactionId: Tx.id,
        amount: Tx.paidAmount,
      }, { id: Tx.id }, tx);

      return payment;
    });
  }

  async getPaymentByTransactionId(transactionId: string) {

  }

  async getPaymentByProviderRef(providerRef: string) {

  }

  async getPaymentStatusByBookingId(bookingId: string) {

  }

  async getPaymentEvents(providerRef: string) {

  }

  async listPaymentsByUser(userId: string) {

  }

  async getPaymentTimeline(transactionId: string) {

  }

  async createPaymentEvent(
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

  async updatePaymentStatus(
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
        where: {
          id: payment.id,
        },
        data: {
          status: payload.status,

          ...(payload.channel && {
            channel: payload.channel,
          }),

          ...(payload.paidAt && {
            paidAt: payload.paidAt,
          }),

          ...(payload.authorization && {
            authorization: payload.authorization,
          }),
        },
      });

      await this.transactionService.syncTransaction(updatedPayment, tx);

      return updatedPayment;
    });
  }


  async createPayment(
    payload: InitializePaymentSchema,
    where: TransactionWhereUniqueInput,
    db: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<Payment> {
    const validatedData =
      PaymentValidation.initializePaymentSchema.parse(payload);

    const transaction = await db.transaction.findUnique({
      where,
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    const existingPayment = await db.payment.findUnique({
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
        connect: { id: transaction.id },
      },
    };

    return db.payment.create({ data });
  }

  // PRIVATE METHODS
  async applyPaymentUpdate(
    paymentId: string,
    data: PaymentUpdateInput,
    db: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<Payment> {
    return db.payment.update({
      where: { id: paymentId },
      data,
    });
  }

  private async updatePaymentManually(
    paymentId: string,
    payload: UpdatePaymentSchema
  ): Promise<Payment> {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
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
        ...(payload.status !== undefined && { status: payload.status }),
        ...(payload.providerRef !== undefined && {
          providerRef: payload.providerRef,
        }),
        ...(paidAtValue !== undefined && { paidAt: paidAtValue }),
        ...(payload.channel !== undefined && { channel: payload.channel }),
      };

      const updatedPayment = await this.applyPaymentUpdate(
        payment.id,
        data,
        tx
      );

      await this.transactionService.syncTransaction(updatedPayment, tx);

      return updatedPayment;
    });
  }

  mapPaymentStatus(status: string): PaymentStatus {
    switch (status.toUpperCase()) {
      case 'INITIAL':
        return PaymentStatus.INITIATED;

      case 'PENDING':
        return PaymentStatus.PENDING;

      case 'SUCCESS':
        return PaymentStatus.SUCCESS;

      case 'FAIL':
        return PaymentStatus.FAILED;

      case 'CLOSE':
        return PaymentStatus.ABANDONED;

      default:
        return PaymentStatus.PENDING;
    }
  }
}

const transactionService = new TransactionService();
export const paymentService = new PaymentService(transactionService);