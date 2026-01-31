import { UserType, CompanyRoleTitle } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';


describe('Admin Routes', () => {
    let adminToken: string;

    beforeAll(async () => {
        await prisma.user.deleteMany();

        const _admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: await AuthUtils.hashPassword('AdminPassword123!'),
                type: UserType.COMPANYUSER,
                role: CompanyRoleTitle.ADMIN,
            },
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@example.com',
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
                    email: 'companyuser@example.com',
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: CompanyRoleTitle.STAFF,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data.user.email', 'companyuser@example.com');
        });

        it('should allow admin to create another admin', async () => {
            const response = await request(app)
                .post('/api/v1/admin/company-user/register')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    firstName: 'New',
                    lastName: 'Admin',
                    email: 'newadmin@example.com',
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: CompanyRoleTitle.ADMIN,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data.user.email', 'newadmin@example.com');
        });
    });
});