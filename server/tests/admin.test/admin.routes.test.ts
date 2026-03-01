import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';


describe('Admin Routes', () => {
    let adminToken: string;
    let adminRole: any;
    let staffRole: any;

    beforeAll(async () => {
        // ensure clean slate for users and roles from previous runs
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();

        adminRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'ADMIN' },
            update: { level: 10, permissions: ['*'] },
            create: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        staffRole = await prisma.companyRoleTitle.upsert({
            where: { title: 'STAFF' },
            update: { level: 8, permissions: [] },
            create: { title: 'STAFF', level: 8, permissions: [] },
        });

        const _admin = await prisma.user.create({
            data: {
                email: 'admin@testmonkey.com',
                password: await AuthUtils.hashPassword('AdminPassword123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: adminRole.id } },
                isActive: true,
            },
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@testmonkey.com',
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
        await prisma.$disconnect();
    });

    describe('POST /api/v1/admin/company-user/register', () => {
        it('should allow admin to create a company user with a specific role', async () => {
            const response = await request(app)
                .post('/api/v1/admin/company-user/register')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'Company',
                    lastName: 'User',
                    email: 'companyuser@exampletest.com',
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: staffRole.id,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data.user.email', 'companyuser@exampletest.com');
        });

        it('should allow admin to create another admin', async () => {
            const response = await request(app)
                .post('/api/v1/admin/company-user/register')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'New',
                    lastName: 'Admin',
                    email: 'newadmin@exampletest.com',
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: adminRole.id,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data.user.email', 'newadmin@exampletest.com');
        });
    });
});