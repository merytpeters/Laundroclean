import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';

const mockVerifyWebhook: any = jest.fn();
const mockParseWebhook: any = jest.fn();
const mockHandleWebhook: any = jest.fn();

(jest as any).unstable_mockModule(
	'../../src/modules/financialtransactions/paymentProviders/opay.service.js',
	() => ({
		opayService: {
			verifyWebhook: mockVerifyWebhook,
			parseWebhook: mockParseWebhook,
		},
	})
);

(jest as any).unstable_mockModule(
	'../../src/modules/financialtransactions/webhooks/webhook.service.js',
	() => ({
		webhookService: {
			handleWebhook: mockHandleWebhook,
		},
	})
);

const { default: WebhookController } = await import(
	'../../src/modules/financialtransactions/webhooks/webhook.controller.js'
);

const makeRes = () => ({
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
} as unknown as Response);

describe('Webhook Controller', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('opayWebhookController', () => {
		it('should reject an invalid webhook signature', async () => {
			mockVerifyWebhook.mockReturnValue(false);

			const req = {
				body: {
					reference: 'OPAY-REF-1234567890',
					status: 'SUCCESS',
				},
				get: jest.fn().mockReturnValue('bad-signature'),
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await WebhookController.opayWebhookController(req, res, next);

			expect(mockVerifyWebhook).toHaveBeenCalledWith(
				JSON.stringify(req.body),
				'bad-signature'
			);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Invalid webhook signature.',
			});
			expect(mockParseWebhook).not.toHaveBeenCalled();
			expect(mockHandleWebhook).not.toHaveBeenCalled();
		});

		it('should accept a valid webhook signature and process the payload', async () => {
			const body = {
				reference: 'OPAY-REF-1234567890',
				status: 'SUCCESS',
				payMethod: 'BANKCARD',
				paidAt: '2026-08-01T10:00:00.000Z',
			};

			const parsedPayload = {
				provider: 'OPAY',
				providerRef: 'OPAY-REF-1234567890',
				eventType: 'SUCCESS',
				payload: body,
				paymentUpdate: {
					providerRef: 'OPAY-REF-1234567890',
					status: 'SUCCESS',
					paidAt: new Date('2026-08-01T10:00:00.000Z'),
					channel: 'BANKCARD',
					authorization: {},
				},
			};

			mockVerifyWebhook.mockReturnValue(true);
			mockParseWebhook.mockReturnValue(parsedPayload);
			mockHandleWebhook.mockResolvedValue({ id: 'payment-1' });

			const req = {
				body,
				get: jest.fn().mockReturnValue('valid-signature'),
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await WebhookController.opayWebhookController(req, res, next);

			expect(mockVerifyWebhook).toHaveBeenCalledWith(
				JSON.stringify(body),
				'valid-signature'
			);
			expect(mockParseWebhook).toHaveBeenCalledWith(body);
			expect(mockHandleWebhook).toHaveBeenCalledWith(parsedPayload);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
			});
			expect(next).not.toHaveBeenCalled();
		});
	});
});
