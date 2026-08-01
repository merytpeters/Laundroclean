import prisma from '../../../config/prisma.js';
import type { HandleWebhookSchema } from '../../../validation/financialtransactions/webhook.validation.js';
import { paymentService } from '../payments/payments.service.js';
import crypto from 'crypto';

interface VerifyWebhookOptions {
    payload: string;
    receivedSignature: string;
    secret: string;
    algorithm: string;
}

export class WebhookService {
    async handleWebhook(payload: HandleWebhookSchema) {
        const event = await paymentService.createPaymentEvent({
            eventType: payload.eventType,
            provider: payload.provider,
            providerRef: payload.providerRef,
            payload: payload.payload,
            signature: payload.signature,
        });
        try {
            const updatedPayment = await paymentService.updatePaymentStatusForWebhookServices(
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

    verifyWebhook({
        payload,
        receivedSignature,
        secret,
        algorithm,
    }: VerifyWebhookOptions): boolean {
        const signature = crypto
            .createHmac(algorithm, secret)
            .update(payload)
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(receivedSignature)
        );
    }
}

export const webhookService = new WebhookService();