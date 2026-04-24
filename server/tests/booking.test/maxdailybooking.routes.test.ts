import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';

describe('Service maxDailyBookings enforcement', () => {
  let adminToken: string;
  let client: any;
  let clientProfile: any;
  let service: any;
  let _servicePrice: any;

  beforeAll(async () => {
    // cleanup
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

    let adminRole = await prisma.companyRoleTitle.findUnique({ where: { title: 'ADMIN' } });
    if (!adminRole) {
      adminRole = await prisma.companyRoleTitle.create({ data: { title: 'ADMIN', level: 10, permissions: ['*'] } });
    }
    const admin = await prisma.user.create({ data: { email: 'admin-limit@test.com', password: await AuthUtils.hashPassword('AdminPass123!'), type: UserType.COMPANYUSER, role: { connect: { id: adminRole.id } }, isActive: true } });

    client = await prisma.user.create({ data: { email: 'client-limit@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: UserType.CLIENT } });
    clientProfile = await prisma.profile.create({ data: { userId: client.id, phoneNumber: '0800000099' } });

    // create a service with maxDailyBookings = 1
    service = await prisma.service.create({ data: { name: 'LimitedService', description: 'Test limit', maxDailyBookings: 1 } });
    _servicePrice = await prisma.servicePrice.create({ data: { serviceId: service.id, amount: '100', currency: 'NAIRA', pricingType: 'PER_KG', isActive: true } });

    const res = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'AdminPass123!' });
    adminToken = res.body?.data?.accessToken ?? res.body?.accessToken ?? res.body?.token;
  });

  afterAll(async () => {
    await prisma.bookingNotifications.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.servicePrice.deleteMany();
    await prisma.service.deleteMany();
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();
    await prisma.$disconnect();
  });

  it('should allow first booking but reject second when maxDailyBookings reached', async () => {
    const date = '2026-12-01T10:00:00Z';

    const payload = { email: client.email, profileId: clientProfile.id, deliveryType: 'PICK_UP', serviceId: service.id, weight: 1, scheduledDate: date };
    const res1 = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(res1.status).toBe(201);

    const res2 = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(res2.status).toBe(409);
    expect(res2.body).toHaveProperty('success', false);
  });
});

export {};
