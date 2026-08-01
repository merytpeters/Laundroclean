import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';

const mockInitiatePayment: any = jest.fn();
const mockGetPaymentById: any = jest.fn();
const mockUpdatePaymentManually: any = jest.fn();

const mockCreatePaymentProof: any = jest.fn();
const mockGetPaymentProofById: any = jest.fn();
const mockUpdatePaymentProof: any = jest.fn();

const mockUploadImage: any = jest.fn();
const mockDeleteImage: any = jest.fn();

const mockGenerateInternalProviderRef: any = jest.fn();

(jest as any).unstable_mockModule(
	'../../src/modules/financialtransactions/payments/payments.service.js',
	() => ({
		paymentService: {
			initiatePayment: mockInitiatePayment,
			getPaymentById: mockGetPaymentById,
			updatePaymentManually: mockUpdatePaymentManually,
		},
	})
);

(jest as any).unstable_mockModule(
	'../../src/modules/financialtransactions/payments/paymentproof.service.js',
	() => ({
		PaymentProofService: {
			createPaymentProof: mockCreatePaymentProof,
			getPaymentProofById: mockGetPaymentProofById,
			updatePaymentProof: mockUpdatePaymentProof,
		},
	})
);

(jest as any).unstable_mockModule(
	'../../src/modules/common/index.js',
	() => ({
		MediaService: {
			uploadImage: mockUploadImage,
			deleteImage: mockDeleteImage,
		},
	})
);

(jest as any).unstable_mockModule(
	'../../src/modules/financialtransactions/index.js',
	() => ({
		PaymentUtils: {
			generateInternalProviderRef: mockGenerateInternalProviderRef,
		},
	})
);

const { default: PaymentController } = await import(
	'../../src/modules/financialtransactions/payments/payment.controller.js'
);

const makeRes = () => ({
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
} as unknown as Response);

describe('Payment Controller', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('initiatePaymentController', () => {
		it('should initiate a payment for a company user', async () => {
			const payment = {
				provider: 'OPAY',
				status: 'INITIATED',
				amount: 15000,
				channel: 'BANKCARD',
				currency: 'NAIRA',
				card: {
					cardNumber: '5399838383838381',
					expiryMonth: '12',
					expiryYear: '2028',
					cvv: '123',
					cardHolderName: 'Jane Doe',
				},
				userInfo: {
					customerName: 'Jane Doe',
					email: 'jane@example.com',
				},
				bookingId: '123e4567-e89b-12d3-a456-426614174000',
				userId: '123e4567-e89b-12d3-a456-426614174001',
			};

			mockInitiatePayment.mockReturnValue({
				id: 'payment-1',
				status: 'INITIATED',
			});

			const req = {
				body: payment,
				user: { id: 'staff-1', type: 'COMPANYUSER' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.initiatePaymentController(req, res, next);

			expect(mockInitiatePayment).toHaveBeenCalledWith(payment);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Payment initiated successfully.',
					data: expect.objectContaining({
						id: 'payment-1',
					}),
				})
			);
			expect(next).not.toHaveBeenCalled();
		});

		it('should reject a payment initiation for another user', async () => {
			const req = {
				body: {
					userId: '123e4567-e89b-12d3-a456-426614174001',
				},
				user: { id: 'different-user', type: 'CLIENT' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.initiatePaymentController(req, res, next);

			expect(res.status).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'You are not authorized to initiated payment for this user.',
				})
			);
		});
	});

	describe('uploadPaymentProofForOtherBankTransferController', () => {
		it('should return 400 when proof file is missing', async () => {
			const req = {
				body: {
					paymentId: '123e4567-e89b-12d3-a456-426614174000',
					fileUrl: 'https://cdn.example.com/old-proof.jpg',
				},
				user: { id: 'user-1', type: 'CLIENT' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.uploadPaymentProofForOtherBankTransferController(
				req,
				res,
				next
			);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'No file uploaded',
			});
			expect(mockGetPaymentById).not.toHaveBeenCalled();
		});

		it('should upload a payment proof for the payment owner', async () => {
			mockGetPaymentById.mockResolvedValue({
				transaction: {
					userId: 'user-1',
				},
			});
			mockUploadImage.mockResolvedValue({
				secure_url: 'https://cdn.example.com/proofs/new-proof.jpg',
				public_id: 'payment/proof/new-proof',
			});
			mockCreatePaymentProof.mockResolvedValue({
				id: 'proof-1',
				paymentId: '123e4567-e89b-12d3-a456-426614174000',
				fileUrl: 'https://cdn.example.com/proofs/new-proof.jpg',
				publicId: 'payment/proof/new-proof',
			});

			const req = {
				body: {
					paymentId: '123e4567-e89b-12d3-a456-426614174000',
					fileUrl: 'https://cdn.example.com/original-proof.jpg',
					fileName: 'receipt.jpg',
					mimeType: 'image/jpeg',
					uploadedBy: 'Jane Doe',
				},
				file: {
					buffer: Buffer.from('proof-image'),
				},
				user: { id: 'user-1', type: 'CLIENT' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.uploadPaymentProofForOtherBankTransferController(
				req,
				res,
				next
			);

			expect(mockGetPaymentById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
			expect(mockUploadImage).toHaveBeenCalledWith(
				Buffer.from('proof-image'),
				'payment/123e4567-e89b-12d3-a456-426614174000/user-1',
				'proof'
			);
			expect(mockCreatePaymentProof).toHaveBeenCalledWith(
				expect.objectContaining({
					paymentId: '123e4567-e89b-12d3-a456-426614174000',
					fileUrl: 'https://cdn.example.com/proofs/new-proof.jpg',
					publicId: 'payment/proof/new-proof',
					fileName: 'receipt.jpg',
					mimeType: 'image/jpeg',
					uploadedBy: 'Jane Doe',
				})
			);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Payment proof uploaded successfully.',
					data: expect.objectContaining({
						id: 'proof-1',
					}),
				})
			);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('updatePaymentProofController', () => {
		it('should update an uploaded payment proof file', async () => {
			mockGetPaymentProofById.mockResolvedValue({
				id: 'proof-1',
				paymentId: 'payment-1',
				payment: {
					transaction: {
						userId: 'user-1',
					},
				},
			});
			mockDeleteImage.mockResolvedValue(undefined);
			mockUploadImage.mockResolvedValue({
				secure_url: 'https://cdn.example.com/proofs/replacement-proof.jpg',
				public_id: 'payment/proof/replacement-proof',
			});
			mockUpdatePaymentProof.mockResolvedValue({
				id: 'proof-1',
				fileUrl: 'https://cdn.example.com/proofs/replacement-proof.jpg',
			});

			const req = {
				params: {
					proofId: 'proof-1',
				},
				body: {
					publicId: 'payment/proof/old-proof',
					fileName: 'updated-receipt.jpg',
					mimeType: 'image/jpeg',
				},
				file: {
					buffer: Buffer.from('replacement-proof'),
				},
				user: { id: 'user-1', type: 'CLIENT' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.updatePaymentProofController(req, res, next);

			expect(mockGetPaymentProofById).toHaveBeenCalledWith('proof-1');
			expect(mockDeleteImage).toHaveBeenCalledWith('payment/proof/old-proof');
			expect(mockUploadImage).toHaveBeenCalledWith(
				Buffer.from('replacement-proof'),
				'payment/payment-1/user-1',
				'proof'
			);
			expect(mockUpdatePaymentProof).toHaveBeenCalledWith(
				'proof-1',
				expect.objectContaining({
					fileUrl: 'https://cdn.example.com/proofs/replacement-proof.jpg',
					publicId: 'payment/proof/replacement-proof',
					fileName: 'updated-receipt.jpg',
					mimeType: 'image/jpeg',
				})
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Payment proof updated successfully.',
					data: expect.objectContaining({
						id: 'proof-1',
					}),
				})
			);
		});
	});

	describe('updatePaymentManuallyController', () => {
		it('should update a payment as a company user', async () => {
			mockGetPaymentById.mockResolvedValue({
				id: 'payment-1',
				channel: 'CASH',
			});
			mockGenerateInternalProviderRef.mockReturnValue('internal-cash-123456');
			mockUpdatePaymentManually.mockResolvedValue({
				id: 'payment-1',
				status: 'SUCCESS',
				providerRef: 'internal-cash-123456',
			});

			const req = {
				params: {
					paymentId: 'payment-1',
				},
				body: {
					status: 'SUCCESS',
				},
				user: { id: 'staff-1', type: 'COMPANYUSER' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.updatePaymentManuallyController(req, res, next);

			expect(mockGetPaymentById).toHaveBeenCalledWith('payment-1');
			expect(mockGenerateInternalProviderRef).toHaveBeenCalledWith('CASH');
			expect(mockUpdatePaymentManually).toHaveBeenCalledWith(
				'payment-1',
				expect.objectContaining({
					status: 'SUCCESS',
					providerRef: 'internal-cash-123456',
				})
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Payment verification update successful.',
					data: expect.objectContaining({
						id: 'payment-1',
					}),
				})
			);
		});
	});

	describe('getPaymentByIdController', () => {
		it('should return a payment for the owner', async () => {
			mockGetPaymentById.mockResolvedValue({
				id: 'payment-1',
				transaction: {
					userId: 'user-1',
				},
			});

			const req = {
				params: {
					paymentId: 'payment-1',
				},
				user: { id: 'user-1', type: 'CLIENT' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.getPaymentByIdController(req, res, next);

			expect(mockGetPaymentById).toHaveBeenCalledWith('payment-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Payment retrieved successfully.',
					data: expect.objectContaining({
						id: 'payment-1',
					}),
				})
			);
		});

		it('should reject access to another user payment', async () => {
			mockGetPaymentById.mockResolvedValue({
				id: 'payment-1',
				transaction: {
					userId: 'user-1',
				},
			});

			const req = {
				params: {
					paymentId: 'payment-1',
				},
				user: { id: 'different-user', type: 'CLIENT' },
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await PaymentController.getPaymentByIdController(req, res, next);

			expect(res.status).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'You are not authorized to see this payment.',
				})
			);
		});
	});
});
