import prisma from '../../../config/prisma.js';
import type { Prisma, Payment, PaymentEvent, Transaction } from '@prisma/client';
import { PaymentValidation } from '../../../validation/index.js';
import type { InitializePaymentSchema, InitiatePaymentSchema, CreatePaymentEventSchema, UpdatePaymentSchema } from '../../../validation/financialtransactions/payment.validation.js';
import type { UpdatePaymentFromWebhookSchema } from '../../../validation/financialtransactions/webhook.validation.js';
import { BadRequest, NotFoundError, ServiceUnavailableError } from '../../../middlewares/errorHandler.js';
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

export class PaymentService {

  constructor(
    private readonly transactionService: TransactionService,
  ) { }

  async initiatePayment(payload: InitiatePaymentSchema) {
    return prisma.$transaction(async (tx) => {
      const transaction = await this.transactionService.createTransaction(
        {
          bookingId: payload.bookingId,
          userId: payload.userId,
        },
        tx
      );

      const { bookingId, userId, ...paymentPayload } = payload;

      const profile = await ProfileService.getActiveProfile({ userId });
      const booking = await BookingService.getBooking({ id: bookingId });

      const customerName = `${profile?.user.firstName} ${profile?.user.lastName}`;

      switch (payload.provider) {
        case 'OPAY': {
          return this.handleOpayPayment(
            paymentPayload,
            transaction,
            profile,
            booking,
            customerName,
            tx
          );
        }

        case 'INTERNAL': {
          return this.handleCashPayment(
            paymentPayload,
            transaction,
            tx
          );
        }

        default:
          throw new BadRequest(
            `${payload.provider} is not currently supported.`
          );
      }
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

    if (validatedData.providerRef) {
      const existingPayment = await db.payment.findUnique({
        where: {
          providerRef: validatedData.providerRef,
        },
      });

      if (existingPayment) {
        return existingPayment;
      }
    }

    const data: PaymentCreateInput = {
      provider: validatedData.provider,
      status: validatedData.status,
      amount: validatedData.amount,
      currency: validatedData.currency,

      transaction: {
        connect: {
          id: transaction.id,
        },
      },
    };

    if (validatedData.providerRef) {
      data.providerRef = validatedData.providerRef;
    }

    if (validatedData.channel) {
      data.channel = validatedData.channel;
    }

    if (validatedData.authorization !== undefined) {
      data.authorization =
        validatedData.authorization as Prisma.InputJsonValue;
    }

    // Internal cash payments are immediately successful
    if (validatedData.provider === 'INTERNAL') {
      data.paidAt = new Date();
    }

    return db.payment.create({
      data,
    });
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

  private async handleCashPayment(
    payload: Omit<InitiatePaymentSchema, 'bookingId' | 'userId'>,
    transaction: Transaction,
    tx: Prisma.TransactionClient
  ): Promise<Payment> {
    const payment = await this.createPayment(
      {
        ...payload,
        provider: 'INTERNAL',
        status: PaymentStatus.SUCCESS,
        providerRef: undefined,
        amount: transaction.paidAmount,
        transactionId: transaction.id,
      },
      { id: transaction.id },
      tx
    );

    await this.transactionService.syncTransaction(payment, tx);

    return payment;
  }

  private async handleOpayPayment(
    payload: Omit<InitiatePaymentSchema, 'bookingId' | 'userId'>,
    transaction: Transaction,
    profile: Awaited<ReturnType<typeof ProfileService.getActiveProfile>>,
    booking: Awaited<ReturnType<typeof BookingService.getBooking>>,
    customerName: string,
    tx: Prisma.TransactionClient
  ): Promise<Payment> {
    let providerRef: string | undefined;
    let paymentStatus = payload.status;

    try {
      const opayResponse = await opayService.initializePayment({
        amount: {
          currency: payload.currency,
          total: payload.amount,
        },
        callbackUrl: WEBHOOK_URL,
        country: 'NG',
        product: {
          description: booking.service.description,
          name: booking.service.name,
        },
        reference: transaction.transactionRef,
        payMethod: payload.channel,
        bankcard: {
          enable3DS: true,
          ...payload.card,
        },
        returnUrl: PAYMENT_REDIRECT_URL,
        customerName:
          payload.userInfo?.customerName ?? customerName,
        userPhone:
          payload.userInfo?.userPhone ??
          profile?.phoneNumber,
        sn: payload.sn?.serialNumber,
        userInfo: {
          userEmail:
            payload.userInfo?.email ??
            profile?.user.email,
          userId: transaction.userId,
          userName:
            payload.userInfo?.customerName ??
            customerName,
          userMobile:
            payload.userInfo?.userMobile ??
            profile?.phoneNumber,
        },
      });

      if (
        opayResponse.data.message === 'SUCCESSFUL' &&
        opayResponse.data.data
      ) {
        providerRef = opayResponse.data.data.reference;
        paymentStatus = this.mapPaymentStatus(
          opayResponse.data.data.status
        );
      }
    } catch {
      throw new ServiceUnavailableError(
        'Unable to initialize payment.'
      );
    }

    if (!providerRef) {
      throw new ServiceUnavailableError(
        'Unable to initialize payment.'
      );
    }

    return this.createPayment(
      {
        ...payload,
        providerRef,
        status: paymentStatus,
        amount: transaction.paidAmount,
        transactionId: transaction.id,
      },
      { id: transaction.id },
      tx
    );
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