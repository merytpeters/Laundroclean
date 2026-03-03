import { UserType } from '@prisma/client';
import { AdminUsersController } from '../../src/modules/admin/index.js';
import prisma from '../../src/config/prisma.js';
import AuthUtils from '../../src/modules/auth/auth.utils.js';
import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';

describe('Admin Users Controller', () => {
  let _admin: any;
  let adminRole: any;
  let next: NextFunction;

  beforeAll(async () => {
    next = jest.fn();
    await prisma.user.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.companyRoleTitle.deleteMany();

    const ROLE_ADMIN = `ADMIN_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    adminRole = await prisma.companyRoleTitle.upsert({
      where: { title: ROLE_ADMIN },
      update: { level: 10, permissions: ['*'] },
      create: { title: ROLE_ADMIN, level: 10, permissions: ['*'] },
    });

    const resCreate = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await AuthUtils.hashPassword('AdminPassword123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
        profile: { create: {} },
      },
    });

    _admin = resCreate;

    // create test users
    await prisma.user.createMany({
      data: [
        { email: 'c1@example.com', password: await AuthUtils.hashPassword('x'), type: UserType.CLIENT, isActive: true },
        { email: 'c2@example.com', password: await AuthUtils.hashPassword('x'), type: UserType.CLIENT, isActive: false },
        { email: 'co1@example.com', password: await AuthUtils.hashPassword('x'), type: UserType.COMPANYUSER, isActive: false },
      ],
    });

    // ensure profiles exist for created users
    const users = await prisma.user.findMany();
    for (const u of users) {
      const p = await prisma.profile.findUnique({ where: { userId: u.id } });
      if (!p) {
        await prisma.profile.create({ data: { userId: u.id } });
      }
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('getProfile returns 404 when userId missing', async () => {
    const req = { params: {} } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await AdminUsersController.getProfile(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getUsersController returns filtered users', async () => {
    const req = { query: { status: 'inactive', type: 'company' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await AdminUsersController.getUsersController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    const called = (res.json as jest.Mock).mock.calls[0][0] as { data: any[] };
    expect(Array.isArray(called.data)).toBe(true);
    expect(called.data.every((p: any) => p.user.isActive === false && p.user.type === 'COMPANYUSER')).toBe(true);
  });

  it('setUserActiveStatusController validates boolean and updates', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'co1@example.com' } });
    const reqBad = { params: { userId: user?.id }, body: { isActive: 'nope' } } as unknown as Request;
    const resBad = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await AdminUsersController.setUserActiveStatusController(reqBad, resBad, next);
    expect(resBad.status).toHaveBeenCalledWith(400);

    const reqGood = { params: { userId: user?.id }, body: { isActive: true } } as unknown as Request;
    const resGood = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await AdminUsersController.setUserActiveStatusController(reqGood, resGood, next);
    expect(resGood.status).toHaveBeenCalledWith(200);
    const called = (resGood.json as jest.Mock).mock.calls[0][0] as { data: { isActive: boolean } };
    expect(called.data.isActive).toBe(true);
  });

  it('restoreUserController returns 404 when userId missing', async () => {
    const req = { params: {} } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await AdminUsersController.restoreUserController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('restoreUserController returns 403 when actor not admin', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'c2@example.com' } });
    const req = { params: { userId: user?.id }, user: { role: { title: 'NOT_ADMIN' } } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    await AdminUsersController.restoreUserController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('restoreUserController restores soft-deleted user when actor is ADMIN', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'c2@example.com' } });
    if (!user) throw new Error('Test user not found');

    // simulate soft-delete
    await prisma.user.update({ where: { id: user.id }, data: { deletedAt: new Date(), isActive: false } });
    await prisma.profile.updateMany({ where: { userId: user.id }, data: { deletedAt: new Date() } });

    const req = { params: { userId: user.id }, user: { role: { title: 'ADMIN' } } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await AdminUsersController.restoreUserController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const called = (res.json as jest.Mock).mock.calls[0][0] as { data: any };
    expect(called.data).toBeDefined();
    expect(called.data.isActive).toBe(true);
  });
});
