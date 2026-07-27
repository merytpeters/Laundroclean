import config from '../../../config/config.js';
import { WebhookService } from '../webhooks/webhook.service.js';
import type { InitializePaymentDto, InitializePaymentBaseDto, InitializePaymentBankCardMethodDto, InitializePaymentBankTransferMethodDto, IntializePaymentForPOSMethodDto, OpayResponseDto } from '../../../validation/financialtransactions/opay.dto.js';
import axios, { type AxiosResponse } from 'axios';
import { sha512 } from 'js-sha512';
import { ServiceUnavailableError } from '../../../middlewares/errorHandler.js';
import type { HandleWebhookSchema } from '../../../validation/financialtransactions/webhook.validation.js';
import { paymentService } from '../payments/payments.service.js';


const webhookService = new WebhookService();
const OPAY_URL = config.OPAY_URL;
const OPAY_MERCHANT_ID = config.OPAY_MERCHANT_ID;
const OPAY_PRIVATE_KEY = config.OPAY_PRIVATE_KEY;

export type OpayWebhookDto = {
    reference: string;
    status: 'INITIAL' | 'PENDING' | 'SUCCESS' | 'FAIL' | 'CLOSE';
    payMethod?: string;
    paidAt?: string;
    signature?: string;
};

export class OpayService {
    parseWebhook(body: OpayWebhookDto): HandleWebhookSchema {
        const {
            reference,
            status,
            paidAt,
            payMethod,
            signature,
            ...authorization
        } = body;

        return {
            provider: 'OPAY',
            providerRef: reference,
            eventType: status,
            signature,
            payload: body,

            paymentUpdate: {
                providerRef: reference,
                status: paymentService.mapPaymentStatus(status),
                paidAt: paidAt ? new Date(paidAt) : undefined,
                channel: payMethod,
                authorization,
            },
        };
    }
    async buildpayloadJSON(
        payload: InitializePaymentDto
    ): Promise<IntializePaymentForPOSMethodDto | InitializePaymentBaseDto | InitializePaymentBankTransferMethodDto | InitializePaymentBankCardMethodDto> {
        const paymentMethod = payload.payMethod.toLowerCase();
        const baseReturn = {
            amount: {
                currency: payload.amount.currency,
                total: payload.amount.total,
            },
            callbackUrl: payload.callbackUrl,
            country: payload.country,
            product: {
                description: payload.product.description,
                name: payload.product.name
            },
            reference: payload.reference,
            payMethod: payload.payMethod,
        };

        switch (paymentMethod) {
            case 'pos':
                return {
                    ...baseReturn,
                    customerName: payload.customerName,
                    sn: payload.sn,
                    userPhone: payload.userPhone
                };

            case 'bank card':
                if (payload.bankcard) {
                    return {
                        ...baseReturn,
                        bankcard: {
                            cardHolderName: payload.bankcard.cardHolderName,
                            cardNumber: payload.bankcard?.cardNumber,
                            cvv: payload.bankcard?.cvv,
                            enable3DS: payload.bankcard?.enable3DS,
                            expiryMonth: payload.bankcard?.expiryMonth,
                            expiryYear: payload.bankcard?.expiryYear,
                        },
                        returnUrl: payload.returnUrl,
                    };
                }


            case 'bank transfer':
                if (payload.customerName && payload.userInfo) {
                    return {
                        ...baseReturn,
                        customerName: payload.customerName,
                        userInfo: {
                            userEmail: payload.userInfo?.userEmail,
                            userId: payload.userInfo?.userId,
                            userName: payload.userInfo?.userName,
                            userMobile: payload.userInfo?.userMobile,
                        },
                        userPhone: payload.userPhone
                    };
                }

            case 'pos wallet':
                return {
                    ...baseReturn
                };

            default:
                payload as never;
                throw new Error('Unhandled payment method');
        }
    }

    async initializePayment(payload: InitializePaymentDto): Promise<AxiosResponse<OpayResponseDto>> {
        try {

            const formData = await this.buildpayloadJSON(payload);

            const private_key_hash = sha512.hmac.create(OPAY_PRIVATE_KEY);
            const hmacsignature = private_key_hash.hex();

            const opayResponse = await axios.post<OpayResponseDto>(
                OPAY_URL,
                formData,
                {
                    headers: {
                        'MerchantId': OPAY_MERCHANT_ID,
                        'Authorization': `Bearer ${hmacsignature}`
                    },
                }
            );

            return opayResponse;

        } catch (error) {
            throw new ServiceUnavailableError(
                'Unable to reach payment provider.'
            );
        }
    }

    verifyWebhook(
        payload: string,
        signature: string
    ): boolean {
        return webhookService.verifyWebhook({
            payload,
            receivedSignature: signature,
            secret: config.OPAY_WEBHOOK_SECRET!,
            algorithm: 'sha512',
        });
    }
}

export const opayService = new OpayService();