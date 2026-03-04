import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('ClientUser Service Routes', () => {
    let clientToken: string;
    let service: any;

    beforeAll(async () => {
        await prisma.user.deleteMany();
        await prisma.service.deleteMany();

        await prisma.user.create({
            data: {
                email: 'client@testmonkey.com',
                password: await AuthUtils.hashPassword('ClientPassword123!'),
                type: UserType.CLIENT,
                isActive: true,
            },
        });

        service = await prisma.service.create({
            data: {
                name: 'Wash & Fold',
                description: 'Standard wash and fold service',
                isActive: true,
            },
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'client@testmonkey.com',
                password: 'ClientPassword123!',
            });

        clientToken =
            response.body?.data?.accessToken ??
            response.body?.accessToken ??
            response.body?.token ??
            response.body?.access_token;

        if (!clientToken) {
            throw new Error('Failed to obtain client access token from login response: ' + JSON.stringify(response.body));
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('GET /api/v1/client/services', () => {
        it('should return list of active services', async () => {
            const res = await request(app)
                .get('/api/v1/client/services')
                .set('Authorization', `Bearer ${clientToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/v1/client/services/:id', () => {
        it('should return details for a service by id', async () => {
            const res = await request(app)
                .get(`/api/v1/client/services/${service.id}`)
                .set('Authorization', `Bearer ${clientToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('data');
            const svc = res.body.data;
            expect(svc).toHaveProperty('id', service.id);
        });
    });
});
