import { UserType } from '@prisma/client';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import DropOffPointUtils from '../../src/modules/locations/dropoffPoint/dropoffpoint.utils';

describe('ServiceArea Routes', () => {
    let adminToken: string;
    let clientToken: string;
    let adminRole: any;

    beforeAll(async () => {
        // cleanup
        await prisma.bookingNotifications.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.servicePrice.deleteMany();
        await prisma.service.deleteMany();
        await prisma.token.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.serviceArea.deleteMany();

        adminRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'ADMIN' },
            update: { level: 10, permissions: ['*'] },
            create: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        const admin = await prisma.user.create({
            data: {
                email: 'admin@servicearearoutes.test',
                password: await AuthUtils.hashPassword('AdminPass123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: adminRole.id } },
                isActive: true,
            },
        });

        const client = await prisma.user.create({
            data: {
                email: 'client@servicearearoutes.test',
                password: await AuthUtils.hashPassword('ClientPass123!'),
                type: UserType.CLIENT,
                isActive: true,
            },
        });

        const ares = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'AdminPass123!' });
        adminToken = ares.body?.data?.accessToken ?? ares.body?.accessToken ?? ares.body?.token ?? ares.body?.access_token;
        if (!adminToken) throw new Error('Failed to get admin token');

        const cres = await request(app).post('/api/v1/auth/login').send({ email: client.email, password: 'ClientPass123!' });
        clientToken = cres.body?.data?.accessToken ?? cres.body?.accessToken ?? cres.body?.token ?? cres.body?.access_token;
        if (!clientToken) throw new Error('Failed to get client token');
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('admin can create and update service area; client can list and get; bounds applied', async () => {
        // mock bounds for initial create
        jest.spyOn(DropOffPointUtils, 'getAreaBound').mockResolvedValueOnce({ minLat: 10, maxLat: 20, minLon: 30, maxLon: 40 } as any);

        const createRes = await request(app)
            .post('/api/v1/servicearea')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Route Area' });

        expect(createRes.status).toBe(201);
        const created = createRes.body.data;
        expect(created).toHaveProperty('id');
        expect(created.latMin).toBe(10);
        expect(created.latMax).toBe(20);
        expect(created.lngMin).toBe(30);
        expect(created.lngMax).toBe(40);

        // client list
        const listRes = await request(app)
            .get('/api/v1/servicearea')
            .set('Authorization', `Bearer ${clientToken}`);

        expect(listRes.status).toBe(200);
        expect(Array.isArray(listRes.body.data)).toBe(true);

        // client get
        const getRes = await request(app)
            .get(`/api/v1/servicearea/${created.id}`)
            .set('Authorization', `Bearer ${clientToken}`);

        expect(getRes.status).toBe(200);

        // mock bounds for update
        jest.spyOn(DropOffPointUtils, 'getAreaBound').mockResolvedValueOnce({ minLat: 50, maxLat: 60, minLon: 70, maxLon: 80 } as any);

        // admin update
        const updateRes = await request(app)
            .patch(`/api/v1/servicearea/${created.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Route Area Updated' });

        expect(updateRes.status).toBe(200);
        const updated = updateRes.body.data;
        expect(updated.latMin).toBe(50);
        expect(updated.latMax).toBe(60);
        expect(updated.lngMin).toBe(70);
        expect(updated.lngMax).toBe(80);

        // admin deactivate
        const inactiveRes = await request(app)
            .patch(`/api/v1/servicearea/${created.id}/inactive`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(inactiveRes.status).toBe(200);

        // admin reactivate
        const activeRes = await request(app)
            .patch(`/api/v1/servicearea/${created.id}/active`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(activeRes.status).toBe(200);

        // create area with no bounds (edge case)
        jest.spyOn(DropOffPointUtils, 'getAreaBound').mockResolvedValueOnce(null as any);

        const createNoBounds = await request(app)
            .post('/api/v1/servicearea')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'NoBounds Area' });

        expect(createNoBounds.status).toBe(201);
        const nb = createNoBounds.body.data;
        expect(nb).toHaveProperty('id');
        expect(nb.latMin).toBeNull();
        expect(nb.latMax).toBeNull();
        expect(nb.lngMin).toBeNull();
        expect(nb.lngMax).toBeNull();
    });
});
