import express from 'express';
import request from 'supertest';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockOpayWebhookController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'opay-webhook' })
);

(jest as any).unstable_mockModule(
    '../../src/modules/financialtransactions/webhooks/webhook.controller.js',
    () => ({
        default: {
            opayWebhookController: mockOpayWebhookController,
        },
    })
);

const { default: webhookRoutes } = await import(
    '../../src/modules/financialtransactions/webhooks/webhook.routes.js'
);

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/webhooks', webhookRoutes);
    return app;
};

describe('Webhook Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/webhooks/opay', () => {
        it('should route to the OPay webhook controller', async () => {
            const payload = {
                reference: 'OPAY-REF-1234567890',
                status: 'SUCCESS',
            };

            const response = await request(buildApp())
                .post('/api/webhooks/opay')
                .set('x-opay-signature', 'signed-payload')
                .send(payload);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'opay-webhook',
                })
            );
            expect(mockOpayWebhookController).toHaveBeenCalledTimes(1);
        });
    });
});
