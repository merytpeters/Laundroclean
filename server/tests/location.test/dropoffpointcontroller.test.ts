import DropOffPointController from '../../src/modules/locations/dropoffPoint/dropoffpoint.controller';
import prisma from '../../src/config/prisma';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import type { Request, Response } from 'express';
import { UserType } from '@prisma/client';

describe('DropOffPoint Controller', () => {
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
        await prisma.dropOffPoint.deleteMany();

        const adminRole = await prisma.companyRoleTitle.create({
            data: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        admin = await prisma.user.create({
            data: {
                email: 'admin@dropoff.test',
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

    it('allows admin to create, update, deactivate and reactivate a dropoff point', async () => {
        const createReq = {
            body: { name: 'Test Point', address: '1 Test St, Test City' },
            user: { id: admin.id, role: { title: 'ADMIN' } },
        } as unknown as Request;

        const createRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await DropOffPointController.createDropoffPointController(createReq, createRes, next as any);

        expect(createRes.status).toHaveBeenCalledWith(201);
        const created = (createRes.json as any).mock.calls[0][0].data;
        expect(created).toHaveProperty('id');

        const getReq = { params: { dropoffId: created.id }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const getRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await DropOffPointController.getDropoffPointController(getReq, getRes, next as any);
        expect(getRes.status).toHaveBeenCalledWith(200);

        const updateReq = { params: { dropoffId: created.id }, body: { name: 'Updated Point' }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const updateRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await DropOffPointController.updateDropoffPointController(updateReq, updateRes, next as any);
        expect(updateRes.status).toHaveBeenCalledWith(200);

        const inactiveReq = { params: { dropoffId: created.id }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const inactiveRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await DropOffPointController.makeInactiveController(inactiveReq, inactiveRes, next as any);
        expect(inactiveRes.status).toHaveBeenCalledWith(200);

        const activeReq = { params: { dropoffId: created.id }, user: { id: admin.id, role: { title: 'ADMIN' } } } as unknown as Request;
        const activeRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await DropOffPointController.makeActiveController(activeReq, activeRes, next as any);
        expect(activeRes.status).toHaveBeenCalledWith(200);
    });
});
