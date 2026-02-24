import { UserType, CompanyRoleTitle } from '@prisma/client';
import { jest } from '@jest/globals';
import AuthUtils from '../../src/modules/auth/auth.utils';
import prisma from '../../src/config/prisma';
import type { Request, Response } from 'express';
import { TokenType } from '@prisma/client';

// Mocks for token and auth services used by the controller
const mockFindToken = jest.fn() as jest.MockedFunction<() => Promise<any | null>>;
const mockUpdateToken = jest.fn() as jest.MockedFunction<() => Promise<void>>;
(jest as any).unstable_mockModule('../../src/modules/token/token.service', () => ({
    default: { findToken: mockFindToken, updateToken: mockUpdateToken },
}));

// Mock auth.service functions (registerUser, loginUser, updateUser) so controller tests are isolated
const mockRegisterUser = jest.fn().mockImplementation(async (newUser: any) => ({
    user: { ...newUser, id: Math.floor(Math.random() * 100000) },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
}));
const mockLoginUser = jest.fn().mockImplementation(async ({ email }: any) => ({
    authenticatedUser: { email },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
}));
const mockUpdateUser = jest.fn() as jest.MockedFunction<() => Promise<any>>;
(jest as any).unstable_mockModule('../../src/modules/auth/auth.service', () => ({
    default: { registerUser: mockRegisterUser, loginUser: mockLoginUser, updateUser: mockUpdateUser },
}));

const { default: AuthController } = await import('../../src/modules/auth/auth.controller');


const uniqueEmail = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

describe('Auth Controller', () => {
    beforeEach(async () => {
        // await prisma.token.deleteMany();
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

    describe('resetPassword', () => {
        beforeEach(() => {
            mockFindToken.mockReset();
            mockUpdateToken.mockReset();
            mockUpdateUser.mockReset();
            mockRegisterUser.mockReset();
            mockLoginUser.mockReset();
        });

        it('returns 403 for invalid or expired token', async () => {
            mockFindToken.mockResolvedValue(null);

            const req = { body: { token: 'bad-token', password: 'NewPass123!' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();

            await AuthController.resetPassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Invalid or expired token',
                })
            );
        });

        it('updates password and invalidates token when token is valid', async () => {
            const tokenRecord = {
                id: 10,
                userId: 42,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
                type: TokenType.RESET,
            } as any;

            mockFindToken.mockResolvedValue(tokenRecord);
            mockUpdateToken.mockResolvedValue(undefined);
            mockUpdateUser.mockResolvedValue({});

            const req = { body: { token: 'valid-token', password: 'NewPass123!' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();

            await AuthController.resetPassword(req, res, next);

            expect(mockUpdateUser).toHaveBeenCalledWith(
                { id: tokenRecord.userId },
                expect.objectContaining({ password: expect.any(String), updatedAt: expect.any(Date) })
            );

            expect(mockUpdateToken).toHaveBeenCalledWith({ id: tokenRecord.id }, { valid: false });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, message: 'Password successfully updated' })
            );
        });
    });
});
