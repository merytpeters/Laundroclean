import { PaymentStatus, Prisma } from '@prisma/client';
import prisma from '../../../config/prisma.js';
import { BadRequest, NotFoundError } from '../../../middlewares/errorHandler.js';
import type { CreatePaymentProofSchema, UpdatePaymentProofSchema } from '../../../validation/financialtransactions/payment.validation.js';


const editableStatuses: PaymentStatus[] = [
    PaymentStatus.INITIATED,
    PaymentStatus.PENDING,
    PaymentStatus.PENDING_VERIFICATION,
    PaymentStatus.REJECTED
];
export class PaymentProofService {
    /**
     * Create a payment proof
     */

    static async createPaymentProof(data: CreatePaymentProofSchema) {
        const payment = await prisma.payment.findUnique({
            where: {id: data.paymentId},
        });
        if (!payment) {
            throw new NotFoundError('Payment not found.');
        }

        return prisma.paymentProof.create({
            data: {
                paymentId: data.paymentId,
                fileUrl: data.fileUrl,
                publicId: data.publicId,
                fileName: data?.fileName || null,
                mimeType: data?.mimeType || null,
                uploadedBy: data?.uploadedBy || null,
            },
        });
    }

    static async updatePaymentProof(proofId: string, data: UpdatePaymentProofSchema) {
        const proof = await prisma.paymentProof.findUnique({
            where: { id: proofId},
        });

        if (!proof) {
            throw new NotFoundError('Payment proof not found');
        }

        const payment = await prisma.payment.findUnique({
            where: {id: proof.paymentId},
        });

        if (!payment) {
            throw new NotFoundError('Payment not found.');
        }

        if(payment.status === null || !editableStatuses.includes(payment.status)) {
            throw new BadRequest(
                'Proof of payment can no longer be updated'
            );
        }

        const updateData: Prisma.PaymentProofUpdateInput = {};
        if (data.fileUrl !== undefined) {
            updateData.fileUrl = data.fileUrl;
        }

        if (data.fileName !== undefined) {
            updateData.fileName = data.fileName;
        }

        if (data.mimeType !== undefined) {
            updateData.mimeType = data.mimeType;
        }

        if (data.publicId !== undefined) {
            updateData.publicId = data.publicId;
        }
        
        return prisma.paymentProof.update({
            where: { id: proofId},
            data: updateData
        });
    }

    static async getPaymentProofById(proofId: string) {
        const proof = await prisma.paymentProof.findUnique({
            where: { id: proofId},
            include: {
                payment: {
                    include: {
                        transaction: true
                    }
                }
            }
        });

        if (!proof) {
            throw new NotFoundError('Payment proof not found');
        }
        return proof;
    }
}