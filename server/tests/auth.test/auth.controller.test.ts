import { UserType, CompanyRoleTitle } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import AuthController from '../../src/modules/auth/auth.controller';
import prisma from '../../src/config/prisma';
import { jest } from '@jest/globals';
import type { Request, Response } from 'express';


const uniqueEmail = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

describe('Auth Controller', () => {
    beforeEach(async () => {
        // await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('clientRegister', () => {
        it('should register a new client', async () => {
            const email = uniqueEmail('client');

            const req = {
                body: {
                    email,
                    password: 'Password123!',
                    type: UserType.CLIENT,
                },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn();

            await AuthController.clientRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        user: expect.objectContaining({ email }),
                    }),
                })
            );
        });

        it('should not allow non-client users to register', async () => {
            const req = {
                body: {
                    email: uniqueEmail('companyuser'),
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn();

            await AuthController.clientRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Company users cannot register here',
                })
            );
        });
    });

    describe('login', () => {
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

            const req = {
                body: { email, password },
                cookies: {},
                signedCookies: {},
                get: jest.fn(),
                header: jest.fn(),
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn();

            await AuthController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        user: expect.objectContaining({ email }),
                    }),
                })
            );
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
                // Store hashed password in DB
                await prisma.user.create({
                    data: {
                        ...user,
                        password: await AuthUtils.hashPassword(user.password),
                    },
                });

                const req = {
                    body: { email: user.email, password: user.password },
                    cookies: {},
                    signedCookies: {},
                    get: jest.fn(),
                    header: jest.fn(),
                } as unknown as Request;

                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                } as unknown as Response;

                const next = jest.fn();

                await AuthController.login(req, res, next);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(
                    expect.objectContaining({
                        success: true,
                        data: expect.objectContaining({
                            user: expect.objectContaining({ email: user.email }),
                        }),
                    })
                );
            }
        });
    });
});
