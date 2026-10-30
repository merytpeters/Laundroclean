import prisma from '../../../config/prisma.js';
import type { Prisma, Transaction, Payment } from '@prisma/client';
import { TransactionValidation } from '../../../validation/index.js';
import type { CreateTransactionSchema } from '../../../validation/financialtransactions/transactions.validation.js';
import { TransactionStatus, PaymentStatus } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../../middlewares/errorHandler.js';
import { PaymentUtils } from '../index.js';
import { PrismaClient } from '@prisma/client';
import { PromoUsageService } from '../../promocode/index.js';


type TransactionCreateInput = Prisma.TransactionCreateInput;

const paymentToTransactionMap: Record<PaymentStatus, TransactionStatus | null> = {
    INITIATED: TransactionStatus.PENDING,
    PENDING: TransactionStatus.PENDING,
    PENDING_VERIFICATION: TransactionStatus.PENDING,
    REJECTED: TransactionStatus.PENDING,
    SUCCESS: TransactionStatus.SUCCESS,
    FAILED: TransactionStatus.FAILED,
    REVERSED: TransactionStatus.REFUNDED,
    EXPIRED: TransactionStatus.CANCELLED,
    ABANDONED: TransactionStatus.CANCELLED,
    REFUNDED: TransactionStatus.REFUNDED,
    PARTIALLY_REFUNDED: TransactionStatus.PARTIALLY_REFUNDED,
};

export class TransactionService {
    async createTransaction(payload: CreateTransactionSchema, db: Prisma.TransactionClient | PrismaClient = prisma
    ): Promise<Transaction> {
        const validatedData = TransactionValidation.createtransactionSchema.parse(payload);
        const booking = await db.booking.findUnique({
            where: { id: validatedData.bookingId },
        });

        if (!booking) {
            throw new NotFoundError('Booking not found!');
        }

        const existing = await db.transaction.findFirst({
            where: {
                bookingId: validatedData.bookingId,
                status: 'PENDING',
            },
            include: {
                payment: true,
            },
        });

        if (existing) return existing;

        const paidAmount = booking.finalAmount ? booking.finalAmount : booking.totalAmount;

        const data: TransactionCreateInput = {
            booking: {
                connect: { id: booking.id },
            },
            userId: validatedData.userId,
            paidAmount: PaymentUtils.toMinorUnit(paidAmount.toNumber()),
            transactionRef: PaymentUtils.generateTransactionRef(),
        };

        return db.transaction.create({ data });

    }

    async syncTransaction(
        payment: Payment,
        db: Prisma.TransactionClient | PrismaClient = prisma
    ) {
        const fullPayment = await db.payment.findUnique({
            where: { id: payment.id },
            include: {
                transaction: true,
            },
        });

        if (!fullPayment) return;

        const transactionStatus = paymentToTransactionMap[payment.status];

        if (!transactionStatus) return;

        const updatedTransaction = await db.transaction.update({
            where: { id: fullPayment.transactionId },
            data: {
                status: transactionStatus,
                paidAt:
                    transactionStatus === TransactionStatus.SUCCESS
                        ? fullPayment.paidAt ?? new Date()
                        : fullPayment.paidAt ?? null,
            },
        });

        if (transactionStatus === TransactionStatus.SUCCESS) {
            await prisma.$transaction(async (tx) => {
                const booking = await db.booking.update({
                    where: { id: fullPayment.transaction.bookingId },
                    data: {
                        status: 'CONFIRMED',
                    },
                    include: { profile: true }
                });
                // implement promousage

                if (booking.promoCodeId) {
                    const promo = await tx.promoCode.findUnique({ where: { id: booking.promoCodeId } });
                    if (!promo) throw new NotFoundError('Promo not found');

                    if (promo.usageLimit !== null && promo.timesUsed >= promo.usageLimit) {
                        throw new ConflictError('Promo usage limit reached');
                    }

                    const usage = await tx.promoUsage.findFirst({ where: { promoCodeId: promo.id, userId: booking.profile.userId } });
                    if (promo.perUserLimit !== null && (usage?.timesUsed ?? 0) >= promo.perUserLimit) {
                        throw new ConflictError('User promo code usage limit reached');
                    }

                    await tx.promoCode.update({ where: { id: promo.id }, data: { timesUsed: { increment: 1 } } });
                    await PromoUsageService.incrementUsage(tx, booking.profile.userId, promo.id);
                }
            });
        }

        if (
            transactionStatus === TransactionStatus.FAILED ||
            transactionStatus === TransactionStatus.CANCELLED ||
            transactionStatus === TransactionStatus.PENDING
        ) {
            await db.booking.update({
                where: { id: fullPayment.transaction.bookingId },
                data: {
                    status: 'PENDING',
                },
            });
        }

        if (transactionStatus === TransactionStatus.REFUNDED) {
            await db.booking.update({
                where: { id: fullPayment.transaction.bookingId },
                data: {
                    status: 'CANCELLED',
                },
            });
        }

        return updatedTransaction;
    }

    async getTransactionByBookingId(bookingId: string) {

    }

    async listTransactionsByStatus(status: TransactionStatus) {

    }
}