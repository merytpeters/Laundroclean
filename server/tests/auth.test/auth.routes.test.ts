import { UserType, CompanyRoleTitle } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import prisma from '../../src/config/prisma';
import request from 'supertest';
import app from '../../src/app';


const uniqueEmail = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

describe('Auth Routes', () => {
    beforeEach(async () => {
        // await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/v1/auth/client/register', () => {
        it('should register a new client', async () => {
            const email = uniqueEmail('client');

            const response = await request(app)
                .post('/api/v1/auth/client/register')
                .send({
                    email,
                    password: 'Password123!',
                    type: UserType.CLIENT,
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data.user.email', email);
        });

        it('should not allow non-client users to register', async () => {
            const email = uniqueEmail('companyuser');

            const response = await request(app)
                .post('/api/v1/auth/client/register')
                .send({
                    email,
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('message', 'Company users cannot register here');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login a user with valid credentials', async () => {
            const email = uniqueEmail('user');
            const password = 'Password123!';

            await prisma.user.create({
                data: {
                    email,
                    password: await AuthUtils.hashPassword(password),
                    type: UserType.COMPANYUSER,
                },
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email,
                    password,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data.user.email', email);
        });

        it('should allow all user types and roles to login', async () => {
            const users = [
                {
                    email: uniqueEmail('client'),
                    password: 'Password123!',
                    type: UserType.CLIENT,
                },
                {
                    email: uniqueEmail('admin'),
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: CompanyRoleTitle.ADMIN,
                },
                {
                    email: uniqueEmail('staff'),
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: CompanyRoleTitle.STAFF,
                },
            ];

            for (const user of users) {
                await prisma.user.create({
                    data: {
                        ...user,
                        password: await AuthUtils.hashPassword(user.password),
                    },
                });

                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        email: user.email,
                        password: user.password,
                    });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('data.user.email', user.email);
            }
        });
    });
});
