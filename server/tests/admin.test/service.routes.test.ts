import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Admin Services Routes', () => {
    let adminToken: string;
    let adminRole: any;

    beforeAll(async () => {
        // ensure clean slate for users, roles and services
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.service.deleteMany();

        adminRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'ADMIN' },
            update: { level: 10, permissions: ['*'] },
            create: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        const _admin = await prisma.user.create({
            data: {
                email: 'admin-services@testmonkey.com',
                password: await AuthUtils.hashPassword('AdminPassword123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: adminRole.id } },
                isActive: true,
            },
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin-services@testmonkey.com',
                password: 'AdminPassword123!',
            });

        adminToken =
            response.body?.data?.accessToken ??
            response.body?.accessToken ??
            response.body?.token ??
            response.body?.access_token;

        if (!adminToken) {
            throw new Error('Failed to obtain admin access token from login response: ' + JSON.stringify(response.body));
        }
    });

    afterAll(async () => {
        await prisma.service.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.$disconnect();
    });

    it('POST /api/v1/admin/services should create a service', async () => {
        const res = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Express Wash', description: 'Fast turnaround service' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('name', 'Express Wash');
    });

    it('GET /api/v1/admin/services should list services', async () => {
        const res = await request(app)
            .get('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('meta');
        expect(res.body.meta).toHaveProperty('total');
    });

    it('GET /api/v1/admin/services/:serviceId should return service details', async () => {
        // create a service to fetch
        const create = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Retrieve Test', description: 'For retrieval' });

        const svc = create.body.data;

        const res = await request(app)
            .get(`/api/v1/admin/services/${svc.id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', svc.id);
    });

    it('PATCH /api/v1/admin/services/:serviceId should update a service', async () => {
        const create = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'To Update', description: 'Before update' });

        const svc = create.body.data;

        const res = await request(app)
            .patch(`/api/v1/admin/services/${svc.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Name' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('name', 'Updated Name');
    });

    // Company-scoped (all-services) routes tests
    it('GET /api/v1/admin/services/all-services should list company services', async () => {
        // ensure at least one service exists
        await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'AllServices List Test', description: 'List test' });

        const res = await request(app)
            .get('/api/v1/admin/services/all-services')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/admin/services/all-services/:serviceId should return company-scoped service details', async () => {
        const create = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'AllServices Get Test', description: 'Get test' });

        const svc = create.body.data;

        const res = await request(app)
            .get(`/api/v1/admin/services/all-services/${svc.id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', svc.id);
    });

    it('PATCH /api/v1/admin/services/all-services/:serviceId should soft-delete the service', async () => {
        const create = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'AllServices SoftDelete Test', description: 'Soft delete' });

        const svc = create.body.data;

        const res = await request(app)
            .patch(`/api/v1/admin/services/all-services/${svc.id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    it('PATCH /api/v1/admin/services/all-services should soft-delete multiple services', async () => {
        const a = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'MultiSoft 1', description: 'msoft1' });

        const b = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'MultiSoft 2', description: 'msoft2' });

        const ids = [a.body.data.id, b.body.data.id];

        const res = await request(app)
            .patch('/api/v1/admin/services/all-services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ids });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it('PATCH /api/v1/admin/services/all-services/:serviceId/restore should restore a soft-deleted service', async () => {
        const create = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Restore Single', description: 'restore single' });

        const svc = create.body.data;

        // soft delete
        await request(app)
            .patch(`/api/v1/admin/services/all-services/${svc.id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        // restore
        const res = await request(app)
            .patch(`/api/v1/admin/services/all-services/${svc.id}/restore`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    it('PATCH /api/v1/admin/services/all-services/restore should restore multiple services', async () => {
        const a = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Restore Multi 1', description: 'rm1' });

        const b = await request(app)
            .post('/api/v1/admin/services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Restore Multi 2', description: 'rm2' });

        // soft delete both
        await request(app)
            .patch('/api/v1/admin/services/all-services')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ids: [a.body.data.id, b.body.data.id] });

        // restore multiple
        const res = await request(app)
            .patch('/api/v1/admin/services/all-services/restore')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ids: [a.body.data.id, b.body.data.id] });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });
});
