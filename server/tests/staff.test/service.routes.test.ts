import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Staff Service Routes', () => {
    let staffToken: string;
    let staffRole: any;

    beforeAll(async () => {
        // ensure clean slate for users, roles and services
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.service.deleteMany();

        staffRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'STAFF' },
            update: { level: 8, permissions: ['service:create', 'service:update', 'service:view'] },
            create: { title: 'STAFF', level: 8, permissions: ['service:create', 'service:update', 'service:view'] },
        });

        const _staffUser = await prisma.user.create({
            data: {
                email: 'staff-services@testmonkey.com',
                password: await AuthUtils.hashPassword('StaffPassword123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: staffRole.id } },
                isActive: true,
            },
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'staff-services@testmonkey.com',
                password: 'StaffPassword123!',
            });

        staffToken =
            response.body?.data?.accessToken ??
            response.body?.accessToken ??
            response.body?.token ??
            response.body?.access_token;

        if (!staffToken) {
            throw new Error('Failed to obtain staff access token from login response: ' + JSON.stringify(response.body));
        }
    });

    afterAll(async () => {
        await prisma.service.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.$disconnect();
    });

    it('POST /api/v1/staff/services should allow staff to create a service', async () => {
        const res = await request(app)
            .post('/api/v1/staff/services')
            .set('Authorization', `Bearer ${staffToken}`)
            .send({ name: 'Staff Wash', description: 'Created by staff' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('name', 'Staff Wash');
    });

    it('GET /api/v1/staff/services should allow staff to list active services', async () => {
        const res = await request(app)
            .get('/api/v1/staff/services')
            .set('Authorization', `Bearer ${staffToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('meta');
    });

    it('GET /api/v1/staff/services/:serviceId should return service details', async () => {
        const create = await request(app)
            .post('/api/v1/staff/services')
            .set('Authorization', `Bearer ${staffToken}`)
            .send({ name: 'Staff Retrieve', description: 'For staff retrieval' });

        const svc = create.body.data;

        const res = await request(app)
            .get(`/api/v1/staff/services/${svc.id}`)
            .set('Authorization', `Bearer ${staffToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', svc.id);
    });

    it('PATCH /api/v1/staff/services/:serviceId should allow staff to update a service', async () => {
        const create = await request(app)
            .post('/api/v1/staff/services')
            .set('Authorization', `Bearer ${staffToken}`)
            .send({ name: 'Staff Update', description: 'Before update' });

        const svc = create.body.data;

        const res = await request(app)
            .patch(`/api/v1/staff/services/${svc.id}`)
            .set('Authorization', `Bearer ${staffToken}`)
            .send({ name: 'Staff Updated' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('name', 'Staff Updated');
    });
});
