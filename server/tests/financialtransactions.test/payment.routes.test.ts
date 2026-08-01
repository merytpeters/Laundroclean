import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import tokenService from '../../src/modules/token/token.service';
import express from 'express';
import request from 'supertest';
import prisma from '../../src/config/prisma';
import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

const mockInitiatePaymentController: any = jest.fn((req: any, res: any) =>
    res.status(201).json({ route: 'initiate' })
);
const mockUploadPaymentProofController: any = jest.fn((req: any, res: any) =>
    res.status(201).json({ route: 'create-proof' })
);
const mockUpdatePaymentProofController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'update-proof', params: req.params })
);
const mockUpdatePaymentManuallyController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'manual-update', params: req.params })
);
const mockGetPaymentByIdController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'get-payment', params: req.params })
);

const mockValidate = jest.fn(() => (req: any, res: any, next: any) => next());
const mockUploadSingle = jest.fn(() => (req: any, res: any, next: any) => {
    req.file = req.file ?? { buffer: Buffer.from('mock-proof') };
    next();
});

(jest as any).unstable_mockModule(
    '../../src/modules/financialtransactions/payments/payment.controller.js',
    () => ({
        default: {
            initiatePaymentController: mockInitiatePaymentController,
            uploadPaymentProofForOtherBankTransferController: mockUploadPaymentProofController,
            updatePaymentProofController: mockUpdatePaymentProofController,
            updatePaymentManuallyController: mockUpdatePaymentManuallyController,
            getPaymentByIdController: mockGetPaymentByIdController,
        },
    })
);

(jest as any).unstable_mockModule(
    '../../src/middlewares/validate.js',
    () => ({
        default: mockValidate,
    })
);

(jest as any).unstable_mockModule(
    '../../src/middlewares/media.upload.js',
    () => ({
        default: {
            single: mockUploadSingle,
        },
    })
);

const { default: paymentRoutes } = await import('../../src/modules/financialtransactions/payments/payment.routes.js');

const uniqueEmail = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

const setUpCleanState = async () => {
    await prisma.paymentProof.deleteMany();
    await prisma.paymentEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.bookingNotifications.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.servicePrice.deleteMany();
    await prisma.service.deleteMany();
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();
};

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/payments', paymentRoutes);
    return app;
};

describe('Payment Routes', () => {
    let adminToken: string;
    let adminRole: any;

    beforeAll(async () => {
        await setUpCleanState();

        adminRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'ADMIN' },
            update: { level: 10, permissions: ['*'] },
            create: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        const adminUser = await prisma.user.create({
            data: {
                email: uniqueEmail('payment-admin'),
                password: await AuthUtils.hashPassword('AdminPassword123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: adminRole.id } },
                isActive: true,
            },
        });

        adminToken = await tokenService.createAccessToken(adminUser.id);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/payments/initiate', () => {
        it('should route to the initiate payment controller', async () => {
            const payload = {
                provider: 'INTERNAL',
                status: 'INITIATED',
                amount: 15000,
                channel: 'CASH',
                currency: 'NAIRA',
                bookingId: '123e4567-e89b-12d3-a456-426614174000',
                userId: '123e4567-e89b-12d3-a456-426614174001',
            };

            const response = await request(buildApp())
                .post('/api/payments/initiate')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({ route: 'initiate' }));
            expect(mockInitiatePaymentController).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /api/payments/proof', () => {
        it('should route to the payment proof upload controller', async () => {
            const response = await request(buildApp())
                .post('/api/payments/proof')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('paymentId', '123e4567-e89b-12d3-a456-426614174000')
                .field('fileUrl', 'https://cdn.example.com/proof.jpg')
                .field('fileName', 'proof.jpg')
                .attach('proof', Buffer.from('proof-image'), 'proof.jpg');

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({ route: 'create-proof' }));
            expect(mockUploadPaymentProofController).toHaveBeenCalledTimes(1);
        });
    });

    describe('PATCH /api/payments/proof/:proofId', () => {
        it('should route to the payment proof update controller', async () => {
            const response = await request(buildApp())
                .patch('/api/payments/proof/proof-1')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('publicId', 'payment/proof/old-proof')
                .field('fileName', 'updated-proof.jpg')
                .field('mimeType', 'image/jpeg')
                .attach('proof', Buffer.from('updated-proof'), 'updated-proof.jpg');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'update-proof',
                    params: { proofId: 'proof-1' },
                })
            );
            expect(mockUpdatePaymentProofController).toHaveBeenCalledTimes(1);
        });
    });

    describe('PATCH /api/payments/companyuser/proof/:proofId', () => {
        it('should route to the company user payment proof update controller', async () => {
            const response = await request(buildApp())
                .patch('/api/payments/companyuser/proof/proof-2')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('publicId', 'payment/proof/old-proof')
                .field('fileName', 'updated-proof.jpg')
                .attach('proof', Buffer.from('updated-proof'), 'updated-proof.jpg');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'update-proof',
                    params: { proofId: 'proof-2' },
                })
            );
            expect(mockUpdatePaymentProofController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/payments/:paymentId', () => {
        it('should route to the public payment lookup controller', async () => {
            const response = await request(buildApp())
                .get('/api/payments/payment-1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'get-payment',
                    params: { paymentId: 'payment-1' },
                })
            );
            expect(mockGetPaymentByIdController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/payments/companyuser/:paymentId', () => {
        it('should route to the company user payment lookup controller', async () => {
            const response = await request(buildApp())
                .get('/api/payments/companyuser/payment-2')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'get-payment',
                    params: { paymentId: 'payment-2' },
                })
            );
            expect(mockGetPaymentByIdController).toHaveBeenCalledTimes(1);
        });
    });

    describe('PATCH /api/payments/companyuser/update/:paymentId', () => {
        it('should route to the manual payment update controller', async () => {
            const response = await request(buildApp())
                .patch('/api/payments/companyuser/update/payment-3')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'SUCCESS' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'manual-update',
                    params: { paymentId: 'payment-3' },
                })
            );
            expect(mockUpdatePaymentManuallyController).toHaveBeenCalledTimes(1);
        });
    });
});
