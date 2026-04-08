import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';

describe('Admin Booking Settings', () => {
  let adminToken: string;

  beforeAll(async () => {
    await prisma.bookingSettings.deleteMany();
    await prisma.companyRoleTitle.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.staffCalendar.deleteMany();
    await prisma.user.deleteMany();

    const adminRole = await prisma.companyRoleTitle.create({
      data: { title: 'ADMIN', level: 10, permissions: ['*'] },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin-settings@test.com',
        password: await AuthUtils.hashPassword('AdminPass123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
      },
    });

    const res = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'AdminPass123!' });
    adminToken = res.body?.data?.accessToken ?? res.body?.accessToken ?? res.body?.token;
  });

  afterAll(async () => {
    await prisma.bookingSettings.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.staffCalendar.deleteMany();
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();
    await prisma.$disconnect();
  });

  it('PATCH /api/v1/admin/booking-settings should upsert booking settings', async () => {
    const payload = { minPickupDays: 7 };

    const res = await request(app).patch('/api/v1/admin/booking-settings').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('minPickupDays', 7);

    // verify persisted
    const record = await prisma.bookingSettings.findUnique({ where: { id: 1 } });
    expect(record).toBeTruthy();
    expect(record?.minPickupDays).toBe(7);
  });
});
