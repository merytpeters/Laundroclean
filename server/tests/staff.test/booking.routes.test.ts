import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';
import { PERMISSIONS } from '../../src/constants/permissions';

describe('Staff Booking Routes', () => {
  let staffToken: string;
  let staffRole: any;
  let staffUser: any;
  let client: any;
  let clientProfile: any;
  let service: any;
  let _servicePrice: any;

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

    // staff role with booking permissions
    staffRole = await prisma.companyRoleTitle.create({
      data: { title: 'STAFF', level: 1, permissions: [PERMISSIONS.BOOKING.CREATE, PERMISSIONS.BOOKING.VIEW, PERMISSIONS.BOOKING.UPDATE] },
    });

    staffUser = await prisma.user.create({
      data: {
        email: 'staff-booking@test.com',
        password: await AuthUtils.hashPassword('StaffPass123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: staffRole.id } },
        isActive: true,
      },
    });

    client = await prisma.user.create({
      data: { email: 'client-staff@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: UserType.CLIENT },
    });

    clientProfile = await prisma.profile.create({ data: { userId: client.id, phoneNumber: '0800000002' } });

    service = await prisma.service.create({ data: { name: 'Fold', description: 'Folding' } });
    _servicePrice = await prisma.servicePrice.create({
      data: { serviceId: service.id, amount: '80', currency: 'NAIRA', pricingType: 'PER_KG', isActive: true },
    });

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

  it('POST /api/v1/staff/booking should allow staff with permission to create booking', async () => {
    const payload = {
      email: client.email,
      profileId: clientProfile.id,
      deliveryType: 'PICK_UP',
      serviceId: service.id,
      weight: 1,
    };

    const res = await request(app).post('/api/v1/staff/booking').set('Authorization', `Bearer ${staffToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('GET /api/v1/staff/bookings should list bookings (staff view)', async () => {
    const res = await request(app).get('/api/v1/staff/bookings').set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});
