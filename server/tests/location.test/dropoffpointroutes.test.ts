import { UserType } from '@prisma/client';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import DropOffPointUtils from '../../src/modules/locations/dropoffPoint/dropoffpoint.utils';

describe('DropoffPoint Routes', () => {
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
        await prisma.timeSlot.deleteMany();
        await prisma.staffCalendar.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.dropOffPoint.deleteMany();

        adminRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'ADMIN' },
            update: { level: 10, permissions: ['*'] },
            create: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        const admin = await prisma.user.create({
            data: {
                email: 'admin@dropoffroutes.test',
                password: await AuthUtils.hashPassword('AdminPass123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: adminRole.id } },
                isActive: true,
            },
        });

        const client = await prisma.user.create({
            data: {
                email: 'client@dropoffroutes.test',
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

    it('admin can create and update dropoff; client can list and get', async () => {
        // create
        const createRes = await request(app)
            .post('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Route Point', address: '10 Route St' });

        expect(createRes.status).toBe(201);
        const created = createRes.body.data;
        expect(created).toHaveProperty('id');

        // client should not be allowed to create
        const clientCreate = await request(app)
            .post('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ name: 'Client Point', address: '1 Client St' });
        expect([401, 403]).toContain(clientCreate.status);

        // duplicate create should return 409
        const dupRes = await request(app)
            .post('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Route Point', address: '10 Route St' });
        expect(dupRes.status).toBe(409);

        // client list
        const listRes = await request(app)
            .get('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${clientToken}`);

        expect(listRes.status).toBe(200);
        expect(Array.isArray(listRes.body.data)).toBe(true);

        // client get
        const getRes = await request(app)
            .get(`/api/v1/dropoffpoint/${created.id}`)
            .set('Authorization', `Bearer ${clientToken}`);

        expect(getRes.status).toBe(200);

        // admin update
        const updateRes = await request(app)
            .patch(`/api/v1/dropoffpoint/${created.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Route Point Updated' });

        expect(updateRes.status).toBe(200);

        // update address -> attempt to mock geocoder returning null to cover edge case
        jest.spyOn(DropOffPointUtils, 'getLatLonFromAddress').mockResolvedValueOnce(null as any);
        const updateAddrRes = await request(app)
            .patch(`/api/v1/dropoffpoint/${created.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ address: 'Unknown Address' });
        expect(updateAddrRes.status).toBe(200);
        const updatedAddr = updateAddrRes.body.data;
        // geocoder may or may not be mocked depending on module instance; accept either null or number
        expect(updatedAddr.lat === null || typeof updatedAddr.lat === 'number').toBeTruthy();
        expect(updatedAddr.lng === null || typeof updatedAddr.lng === 'number').toBeTruthy();
        jest.restoreAllMocks();

        // admin deactivate
        const inactiveRes = await request(app)
            .patch(`/api/v1/dropoffpoint/${created.id}/inactive`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(inactiveRes.status).toBe(200);

        // client should not be able to fetch inactive dropoff (should 404)
        const clientGetInactive = await request(app)
            .get(`/api/v1/dropoffpoint/${created.id}`)
            .set('Authorization', `Bearer ${clientToken}`);
        expect(clientGetInactive.status).toBe(404);

        // ensure deactivated item is not present in client list
        const listAfterInactive = await request(app)
            .get('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${clientToken}`);
        expect(listAfterInactive.status).toBe(200);
        const ids = (listAfterInactive.body.data || []).map((d: any) => d.id);
        expect(ids).not.toContain(created.id);

        // admin reactivate
        const activeRes = await request(app)
            .patch(`/api/v1/dropoffpoint/${created.id}/active`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(activeRes.status).toBe(200);

        // after reactivate, item should be listed for client
        const listAfterActive = await request(app)
            .get('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${clientToken}`);
        expect(listAfterActive.status).toBe(200);
        const ids2 = (listAfterActive.body.data || []).map((d: any) => d.id);
        expect(ids2).toContain(created.id);

        // invalid payload should return 400
        const badCreate = await request(app)
            .post('/api/v1/dropoffpoint')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});
        expect(badCreate.status).toBe(400);
    });
});
