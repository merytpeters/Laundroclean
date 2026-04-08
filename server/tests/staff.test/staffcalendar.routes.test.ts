import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';
import { PERMISSIONS } from '../../src/constants/permissions';

describe('Staff Calendar Routes', () => {
  let staffToken: string;
  let staffRole: any;
  let staffUser: any;
  let client: any;
  let clientProfile: any;

  beforeAll(async () => {
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

    staffRole = await prisma.companyRoleTitle.create({
      data: {
        title: 'STAFF_CAL',
        level: 1,
        permissions: [
          PERMISSIONS.CALENDAR.CREATE,
          PERMISSIONS.CALENDAR.VIEW,
          PERMISSIONS.CALENDAR.UPDATE,
          PERMISSIONS.TIMESLOT.CREATE,
          PERMISSIONS.TIMESLOT.VIEW,
          PERMISSIONS.TIMESLOT.UPDATE,
        ],
      },
    });

    staffUser = await prisma.user.create({
      data: {
        email: 'staff-calendar@test.com',
        password: await AuthUtils.hashPassword('StaffPass123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: staffRole.id } },
        isActive: true,
      },
    });

    client = await prisma.user.create({
      data: { email: 'client-calendar@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: UserType.CLIENT },
    });

    clientProfile = await prisma.profile.create({ data: { userId: client.id, phoneNumber: '0800000003' } });

    const res = await request(app).post('/api/v1/auth/login').send({ email: staffUser.email, password: 'StaffPass123!' });
    staffToken = res.body?.data?.accessToken ?? res.body?.accessToken ?? res.body?.token;
  });

  afterAll(async () => {
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
    await prisma.$disconnect();
  });

  it('POST /api/v1/staff/staff-calendars should allow staff with permission to create calendar', async () => {
    const payload = {
      userId: staffUser.id,
      date: new Date().toISOString(),
      notes: 'Staff calendar for tests',
    };

    const res = await request(app).post('/api/v1/staff/staff-calendars').set('Authorization', `Bearer ${staffToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('GET /api/v1/staff/staff-calendars should list calendars (staff view)', async () => {
    const res = await request(app).get('/api/v1/staff/staff-calendars').set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/staff/timeslots should allow staff with permission to create timeslot', async () => {
    // get an existing calendar for this staff
    const calendars = await prisma.staffCalendar.findMany({ where: { userId: staffUser.id } });
    expect(calendars.length).toBeGreaterThanOrEqual(1);
    const calendar = calendars[0];

    const payload = {
      staffCalendarId: calendar.id,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      maxBookings: 2,
    };

    const res = await request(app).post('/api/v1/staff/timeslots').set('Authorization', `Bearer ${staffToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
  });

  it('GET /api/v1/staff/timeslots should list timeslots', async () => {
    const res = await request(app).get('/api/v1/staff/timeslots').set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
