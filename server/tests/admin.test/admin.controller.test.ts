import { UserType, CompanyRoleTitle } from '@prisma/client';
import AdminController from '../../src/modules/admin/admin.controller';
import prisma from '../../src/config/prisma';
import { jest } from '@jest/globals';
import type { Request, Response } from 'express';

describe('Admin Controller', () => {
    let admin: { id: string; email: string; role: CompanyRoleTitle; };
    let next: jest.Mock;

    beforeAll(async () => {
        await prisma.user.deleteMany();

        const req = {
            body: {
                email: 'admin@example.com',
                password: 'AdminPassword123!',
                type: UserType.COMPANYUSER,
                role: CompanyRoleTitle.ADMIN,
            },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(() => ({ mock: { calls: [] } })),
        } as unknown as Response;
        next = jest.fn();

        await AdminController.companyRegister(req, res, next);
        admin = (res.json as any).mock.calls[0][0].data.user;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('companyRegister', () => {
        it('should allow admin to create a company user with a specific role', async () => {
            const req = {
                body: {
                    firstName: 'Company',
                    lastName: 'User',
                    email: 'companyuser@example.com',
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: CompanyRoleTitle.STAFF,
                },
                user: admin,
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;


            await AdminController.companyRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        user: expect.objectContaining({ email: 'companyuser@example.com' }),
                    }),
                })
            );
        });

        it('should allow admin to create another admin', async () => {
            const req = {
                body: {
                    firstName: 'New',
                    lastName: 'Admin',
                    email: 'newadmin@example.com',
                    password: 'Password123!',
                    type: UserType.COMPANYUSER,
                    role: CompanyRoleTitle.ADMIN,
                },
                user: admin,
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await AdminController.companyRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        user: expect.objectContaining({ email: 'newadmin@example.com' }),
                    }),
                })
            );
        });
    });
});