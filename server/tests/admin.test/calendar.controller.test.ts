import { UserType } from '@prisma/client';
import CalendarController from '../../src/modules/admin/companyuser.calendar/calendar.controller';
import AdminController from '../../src/modules/admin/admin.controller';
import prisma from '../../src/config/prisma';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import type { Request, Response } from 'express';

describe('Calendar Controller', () => {
    let admin: any;
    let staff: any;
    let adminRole: any;
    let staffRole: any;
    let next: jest.Mock;
    let createdCalendar: any;
    let createdSlot: any;

    beforeAll(async () => {
        // clean dependent tables
        await prisma.bookingNotifications.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.timeSlot.deleteMany();
        await prisma.staffCalendar.deleteMany();
        await prisma.servicePrice.deleteMany();
        await prisma.service.deleteMany();
        await prisma.token.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.timeSlot.deleteMany();
        await prisma.staffCalendar.deleteMany();
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

        // create admin via controller to follow same flow
        const reqAdmin = {
            body: {
                email: 'admin-calendar@tester.com',
                password: 'AdminPassword123!',
                type: UserType.COMPANYUSER,
                role: adminRole.id,
            },
        } as unknown as Request;
        const resAdmin = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(() => ({ mock: { calls: [] } })),
        } as unknown as Response;
        next = jest.fn();

        await AdminController.companyRegister(reqAdmin, resAdmin, next);

        if ((resAdmin.json as any).mock.calls.length > 0) {
            admin = (resAdmin.json as any).mock.calls[0][0].data.user;
        } else {
            admin = await prisma.user.findUnique({ where: { email: 'admin-calendar@tester.com' }, include: { role: true } }) as any;
        }

        // create a staff user using the admin
        const reqStaff = {
            body: {
                firstName: 'Staff',
                lastName: 'Member',
                email: 'staff-calendar@example.com',
                password: 'Password123!',
                type: UserType.COMPANYUSER,
                role: staffRole.id,
            },
            user: admin,
        } as unknown as Request;
        const resStaff = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await AdminController.companyRegister(reqStaff, resStaff, next);

        if ((resStaff.json as any).mock.calls.length > 0) {
            staff = (resStaff.json as any).mock.calls[0][0].data.user;
        } else {
            staff = await prisma.user.findUnique({ where: { email: 'staff-calendar@example.com' }, include: { role: true } }) as any;
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a staff calendar with nested timeslots', async () => {
        const start = new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const req = {
            body: {
                userId: staff.id,
                date: new Date().toISOString(),
                notes: 'Morning shift',
                timeSlots: [{ startTime: start.toISOString(), endTime: end.toISOString() }],
            },
            user: staff,
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await CalendarController.createStaffCalendarController(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
        createdCalendar = (res.json as any).mock.calls[0][0].data;
        expect(createdCalendar).toHaveProperty('id');
        expect(createdCalendar).toHaveProperty('timeSlots');
        expect(Array.isArray(createdCalendar.timeSlots)).toBe(true);
        createdSlot = createdCalendar.timeSlots[0];
    });

    it('should list staff calendars for the staff user', async () => {
        const req = { query: { userId: staff.id } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.listStaffCalendarsController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as any).mock.calls[0][0];
        expect(payload.success).toBe(true);
        expect(Array.isArray(payload.data)).toBe(true);
        expect(payload.data.find((c: any) => c.id === createdCalendar.id)).toBeTruthy();
    });

    it('should get a single staff calendar', async () => {
        const req = { params: { calendarId: createdCalendar.id } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.getStaffCalendarController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as any).mock.calls[0][0];
        expect(payload.data.id).toBe(createdCalendar.id);
    });

    it('should update a staff calendar', async () => {
        const req = { params: { calendarId: createdCalendar.id }, body: { notes: 'Updated notes' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.updateStaffCalendarController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as any).mock.calls[0][0];
        expect(payload.data.notes).toBe('Updated notes');
    });

    it('should list time slots for the calendar', async () => {
        const req = { query: { staffCalendarId: createdCalendar.id } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.listTimeSlotsController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as any).mock.calls[0][0];
        expect(Array.isArray(payload.data)).toBe(true);
        expect(payload.data.find((s: any) => s.id === createdSlot.id)).toBeTruthy();
    });

    it('should get a single timeslot', async () => {
        const req = { params: { timeslotId: createdSlot.id } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.getTimeSlotController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as any).mock.calls[0][0];
        expect(payload.data.id).toBe(createdSlot.id);
    });

    it('should forbid staff from deleting a timeslot', async () => {
        const req = { params: { timeslotId: createdSlot.id }, user: staff } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.deleteTimeSlotController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow admin to delete a timeslot', async () => {
        const req = { params: { timeslotId: createdSlot.id }, user: { ...admin, role: { title: 'ADMIN' } } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
        await CalendarController.deleteTimeSlotController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should forbid staff from deleting a calendar', async () => {
        const req = { params: { calendarId: createdCalendar.id }, user: staff } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.deleteStaffCalendarController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow admin to delete a calendar', async () => {
        // create a fresh calendar to delete
        const reqCreate = {
            body: { userId: staff.id, date: new Date().toISOString(), notes: 'To delete' },
            user: admin,
        } as unknown as Request;
        const resCreate = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await CalendarController.createStaffCalendarController(reqCreate, resCreate, next);
        const calendarToDelete = (resCreate.json as any).mock.calls[0][0].data;

        const req = { params: { calendarId: calendarToDelete.id }, user: { ...admin, role: { title: 'ADMIN' } } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
        await CalendarController.deleteStaffCalendarController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(204);
    });
});

export {};
