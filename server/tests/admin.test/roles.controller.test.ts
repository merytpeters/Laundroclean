import {RolesController, RolesService } from '../../src/modules/admin/index';
import prisma from '../../src/config/prisma';
import { jest } from '@jest/globals';
import type { Request, Response } from 'express';

describe('Roles Controller', () => {
  beforeAll(async () => {
    await prisma.companyRoleTitle.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('createRole should create a role', async () => {
    const req = { body: { title: 'MANAGER', level: 2, permissions: ['read'] } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await RolesController.createRole(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ role: expect.objectContaining({ title: 'MANAGER' }) }),
      })
    );
  });

  it('getRoles should return list of roles', async () => {
    await RolesService.createRole({ title: 'VIEWER', level: 1 });

    const req = {} as unknown as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await RolesController.getRoles(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ roles: expect.any(Array) }),
      })
    );
  });

  it('getRole should return a single role', async () => {
    const created = await RolesService.createRole({ title: 'SINGLEROLE', level: 3 });

    const req = { params: { id: String(created.id) } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await RolesController.getRole(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ role: expect.objectContaining({ title: 'SINGLEROLE' }) }),
      })
    );
  });

  it('updateRole should update and return role', async () => {
    const created = await RolesService.createRole({ title: 'ToUpdate', level: 4 });

    const req = { params: { id: String(created.id) }, body: { title: 'Updated' } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await RolesController.updateRole(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ role: expect.objectContaining({ title: 'UPDATED' }) }),
      })
    );
  });

  it('deleteRole should delete role and return success', async () => {
    const created = await RolesService.createRole({ title: 'ToDelete', level: 5 });

    const req = { params: { id: String(created.id) } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await RolesController.deleteRole(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
