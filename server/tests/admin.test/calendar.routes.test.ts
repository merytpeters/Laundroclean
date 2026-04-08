import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Admin Calendar Routes', () => {
    let adminToken: string;
    let adminRole: any;
    let staffRole: any;
    let staff: any;
    let calendar: any;
    let timeslot: any;

    beforeAll(async () => {
        // ensure clean slate for dependent data to avoid FK constraints
        await prisma.bookingNotifications.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.timeSlot.deleteMany();
        await prisma.staffCalendar.deleteMany();
        await prisma.servicePrice.deleteMany();
        await prisma.service.deleteMany();
        await prisma.token.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.user.deleteMany();
        await prisma.companyRoleTitle.deleteMany();

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

        const _admin = await prisma.user.create({
            data: {
                email: 'admin-calendar-routes@test.com',
                password: await AuthUtils.hashPassword('AdminPassword123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: adminRole.id } },
                isActive: true,
            },
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'admin-calendar-routes@test.com', password: 'AdminPassword123!' });

        adminToken =
            response.body?.data?.accessToken ??
            response.body?.accessToken ??
            response.body?.token ??
            response.body?.access_token;

        // create a staff user to attach calendars to
        staff = await prisma.user.create({
            data: {
                email: 'staff-calendar-routes@test.com',
                password: await AuthUtils.hashPassword('StaffPassword123!'),
                type: UserType.COMPANYUSER,
                role: { connect: { id: staffRole.id } },
                isActive: true,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('POST /api/v1/admin/staff-calendars should create staff calendar', async () => {
        const res = await request(app)
            .post('/api/v1/admin/staff-calendars')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ userId: staff.id, date: new Date().toISOString(), notes: 'Morning shift' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        calendar = res.body.data;
        expect(calendar).toHaveProperty('id');
    });

    it('GET /api/v1/admin/staff-calendars should list calendars', async () => {
        const res = await request(app).get('/api/v1/admin/staff-calendars').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.find((c: any) => c.id === calendar.id)).toBeTruthy();
    });

    it('GET /api/v1/admin/staff-calendars/:calendarId should return calendar', async () => {
        const res = await request(app).get(`/api/v1/admin/staff-calendars/${calendar.id}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.id).toBe(calendar.id);
    });

    it('PATCH /api/v1/admin/staff-calendars/:calendarId should update calendar', async () => {
        const res = await request(app)
            .patch(`/api/v1/admin/staff-calendars/${calendar.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ notes: 'Updated notes' });
        expect(res.status).toBe(200);
        expect(res.body.data.notes).toBe('Updated notes');
    });

    it('POST /api/v1/admin/timeslots should create a timeslot', async () => {
        const start = new Date();
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        const res = await request(app)
            .post('/api/v1/admin/timeslots')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ staffCalendarId: calendar.id, startTime: start.toISOString(), endTime: end.toISOString(), maxBookings: 1 });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        const slot = res.body.data;
        expect(slot).toHaveProperty('id');
        timeslot = slot;
    });

    it('GET /api/v1/admin/timeslots should list timeslots', async () => {
        const res = await request(app).get('/api/v1/admin/timeslots').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.find((s: any) => s.id === timeslot.id)).toBeTruthy();
    });

    it('GET /api/v1/admin/timeslots/:timeslotId should return slot', async () => {
        const res = await request(app).get(`/api/v1/admin/timeslots/${timeslot.id}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(timeslot.id);
    });

    it('PATCH /api/v1/admin/timeslots/:timeslotId should update slot', async () => {
        const res = await request(app)
            .patch(`/api/v1/admin/timeslots/${timeslot.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ notes: 'Slot note' });
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id', timeslot.id);
    });

    it('DELETE /api/v1/admin/timeslots/:timeslotId should delete slot', async () => {
        const res = await request(app).delete(`/api/v1/admin/timeslots/${timeslot.id}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    });

    it('DELETE /api/v1/admin/staff-calendars/:calendarId should delete calendar', async () => {
        const res = await request(app).delete(`/api/v1/admin/staff-calendars/${calendar.id}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    });
});

export {};
