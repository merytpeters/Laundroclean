import ServiceareaController from '../../src/modules/locations/serviceArea/servicearea.controller';
import prisma from '../../src/config/prisma';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import type { Request, Response } from 'express';
import { UserType } from '@prisma/client';

describe('ServiceArea Controller', () => {
    let admin: any;
    let next: jest.Mock;

    beforeAll(async () => {
        // clean up
        await prisma.bookingNotifications.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.servicePrice.deleteMany();
        await prisma.service.deleteMany();
        await prisma.token.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.timeSlot.deleteMany();
        await prisma.staffCalendar.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();
        await prisma.serviceArea.deleteMany();

        const adminRole = await prisma.companyRoleTitle.create({
            data: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        admin = await prisma.user.create({
            data: {
                email: 'admin@servicearea.test',
                password: 'pass',
                type: UserType.COMPANYUSER,
                roleId: adminRole.id,
                isActive: true,
            },
        });

        next = jest.fn();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('allows admin to create, update, deactivate and reactivate a service area', async () => {
        const createReq = {
            body: { name: 'Test Area' },
            user: { id: admin.id, role: { title: 'ADMIN' } },
        } as unknown as Request;

        const createRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await ServiceareaController.createServiceAreaController(createReq, createRes, next as any);

        expect(createRes.status).toHaveBeenCalledWith(201);
        const created = (createRes.json as any).mock.calls[0][0].data;
        expect(created).toHaveProperty('id');

        const getReq = { params: { serviceareaId: created.id }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const getRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await ServiceareaController.getServiceAreaController(getReq, getRes, next as any);
        expect(getRes.status).toHaveBeenCalledWith(200);

        const updateReq = { params: { serviceareaId: created.id }, body: { name: 'Updated Area' }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const updateRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await ServiceareaController.updateServiceAreaController(updateReq, updateRes, next as any);
        expect(updateRes.status).toHaveBeenCalledWith(200);

        const inactiveReq = { params: { serviceareaId: created.id }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const inactiveRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await ServiceareaController.makeServiceAreaInactiveController(inactiveReq, inactiveRes, next as any);
        expect(inactiveRes.status).toHaveBeenCalledWith(200);

        const activeReq = { params: { serviceareaId: created.id }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const activeRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await ServiceareaController.makeServiceAreaActiveController(activeReq, activeRes, next as any);
        expect(activeRes.status).toHaveBeenCalledWith(200);
    });
});
