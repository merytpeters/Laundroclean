import { UserType } from '@prisma/client';
import AdminController from '../../src/modules/admin/admin.controller';
import prisma from '../../src/config/prisma';
import { jest } from '@jest/globals';
import type { Request, Response } from 'express';

describe('Admin Controller', () => {
    let admin: { id: string; email: string; role: any };
    let adminRole: any;
    let staffRole: any;
    let next: jest.Mock;

    beforeAll(async () => {
        await prisma.user.deleteMany();

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

        const req = {
            body: {
                email: 'admin@tester.com',
                password: 'AdminPassword123!',
                type: UserType.COMPANYUSER,
                role: adminRole.id,
            },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(() => ({ mock: { calls: [] } })),
        } as unknown as Response;
        next = jest.fn();

        await AdminController.companyRegister(req, res, next);

        // If the controller didn't call `res.json` (some errors call `next(err)`),
        // fall back to reading the created user from the database.
        if ((res.json as any).mock.calls.length > 0) {
            admin = (res.json as any).mock.calls[0][0].data.user;
        } else {
            admin = await prisma.user.findUnique({ where: { email: 'admin@tester.com' } }) as any;
        }
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
                    role: staffRole.id,
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
                    role: adminRole.id,
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