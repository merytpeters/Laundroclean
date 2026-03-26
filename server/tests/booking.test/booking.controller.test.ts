import { BookingController } from '../../src/modules/booking/index';
import prisma from '../../src/config/prisma';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import type { Request, Response } from 'express';

describe('Booking Controller', () => {
    let admin: any;
    let client: any;
    let clientProfile: any;
    let service: any;
    let servicePrice: any;
    let next: jest.Mock;

    beforeAll(async () => {
        // clean up relevant tables (child tables first)
        await prisma.bookingNotifications.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.servicePrice.deleteMany();
        await prisma.service.deleteMany();
        await prisma.token.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();

        const adminRole = await prisma.companyRoleTitle.create({
            data: { title: 'ADMIN', level: 10, permissions: ['*'] },
        });

        admin = await prisma.user.create({
            data: {
                email: 'admin@tester.com',
                password: 'pass',
                type: 'COMPANYUSER',
                roleId: adminRole.id,
            },
        });

        client = await prisma.user.create({
            data: { email: 'client@example.com', password: 'pass', type: 'CLIENT' },
        });

        clientProfile = await prisma.profile.create({
            data: { userId: client.id, phoneNumber: '0800000000' },
        });

        service = await prisma.service.create({ data: { name: 'Wash', description: 'Wash service' } });

        servicePrice = await prisma.servicePrice.create({
            data: {
                serviceId: service.id,
                amount: '100',
                currency: 'NAIRA',
                pricingType: 'PER_KG',
                isActive: true,
            },
        });

        next = jest.fn();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('allows admin to create a booking on behalf of a client', async () => {
        const req = {
            body: {
                email: client.email,
                profileId: clientProfile.id,
                deliveryType: 'PICK_UP',
                serviceId: service.id,
                weight: 2,
            },
            user: admin,
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await BookingController.createBookingController(req, res, next as any);

        expect(res.status).toHaveBeenCalledWith(201);
        expect((res.json as any).mock.calls[0][0]).toMatchObject({ success: true });
        const booking = (res.json as any).mock.calls[0][0].data;
        expect(booking).toHaveProperty('id');
        expect(booking).toHaveProperty('customBookingId');
    });

    it('allows client to list their bookings', async () => {
        const req = {
            query: {},
            user: { id: client.id, type: 'CLIENT' },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await BookingController.listBookingsController(req, res, next as any);

        expect(res.status).toHaveBeenCalledWith(200);
        const response = (res.json as any).mock.calls[0][0];
        expect(response).toMatchObject({ success: true });
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThanOrEqual(1);
    });

    it('allows client to cancel their booking and admin to restore it', async () => {
        // pick a booking owned by client
        const [booking] = await prisma.booking.findMany({ where: { profileId: clientProfile.id } });
        expect(booking).toBeDefined();

        const cancelReq = { params: { bookingId: booking.id }, user: { id: client.id, type: 'CLIENT' } } as unknown as Request;
        const cancelRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

        await BookingController.cancelBookingController(cancelReq, cancelRes, next as any);
        expect(cancelRes.status).toHaveBeenCalledWith(204);

        // admin restores (include role title so controller recognizes admin)
        const restoreReq = { params: { bookingId: booking.id }, user: { ...admin, role: { title: 'ADMIN' } } } as unknown as Request;
        const restoreRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await BookingController.restoreBookingController(restoreReq, restoreRes, next as any);
        expect(restoreRes.status).toHaveBeenCalledWith(200);
        const restored = (restoreRes.json as any).mock.calls[0][0].data;
        expect(restored).toHaveProperty('id', booking.id);
        expect(restored.deletedAt).toBeNull();
    });
});
