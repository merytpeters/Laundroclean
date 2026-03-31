import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';

describe('Admin Booking Routes', () => {
  let adminToken: string;
  let client: any;
  let clientProfile: any;
  let service: any;
  let _servicePrice: any;
  let staff: any;

  beforeAll(async () => {
    // clean dependent tables
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

    const admin = await prisma.user.create({
      data: {
        email: 'admin-booking@test.com',
        password: await AuthUtils.hashPassword('AdminPass123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
      },
    });

    const staffRole = await prisma.companyRoleTitle.create({
      data: { title: 'WASHER', level: 6, permissions: [''] },
    });

    staff = await prisma.user.create({
      data: {
        email: 'staff-booking-assign@test.com',
        password: await AuthUtils.hashPassword('StaffPass123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: staffRole.id } },
        isActive: true,
      },
    });

    // create a client to act on behalf of
    client = await prisma.user.create({
      data: { email: 'client-booking@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: UserType.CLIENT },
    });

    clientProfile = await prisma.profile.create({ data: { userId: client.id, phoneNumber: '0800000000' } });

    // service + price
    service = await prisma.service.create({ data: { name: 'Wash', description: 'Wash service' } });
    _servicePrice = await prisma.servicePrice.create({
      data: { serviceId: service.id, amount: '100', currency: 'NAIRA', pricingType: 'PER_KG', isActive: true },
    });

    // login admin to obtain token
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

  it('POST /api/v1/admin/booking should create a booking for a client', async () => {
    const payload = {
      email: client.email,
      profileId: clientProfile.id,
      deliveryType: 'PICK_UP',
      serviceId: service.id,
      weight: 2,
    };

    const res = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('POST /api/v1/admin/booking should create a booking for a client and assign a staff', async () => {
    const payload = {
      email: client.email,
      profileId: clientProfile.id,
      deliveryType: 'PICK_UP',
      serviceId: service.id,
      weight: 2,
      assignedToId: staff.id
    };

    const res = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.assignedTo).toBeDefined();
  });

  it('GET /api/v1/admin/bookings should list bookings', async () => {
    const res = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/admin/bookings/:bookingId should return booking details', async () => {
    const list = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    const booking = list.body.data[0];
    const res = await request(app).get(`/api/v1/admin/bookings/${booking.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', booking.id);
  });

  it('PATCH /api/v1/admin/booking/:bookingId should update booking', async () => {
    const list = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    const booking = list.body.data[0];
    const res = await request(app)
      .patch(`/api/v1/admin/booking/${booking.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ additionalNotes: 'Please handle with care', weight: booking.weight ?? 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', booking.id);
  });

  it('PATCH /api/v1/admin/booking/:bookingId should update booking and unassign staff', async () => {
    const list = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    const booking = list.body.data[0];
    const res = await request(app)
      .patch(`/api/v1/admin/booking/${booking.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ additionalNotes: 'Please handle with care', weight: booking.weight ?? 2, assignedToId: null });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', booking.id);
    expect(res.body.data.assignedTo).toBeNull();
  });

  it('PATCH /api/v1/admin/booking/:bookingId should update booking and reassign staff', async () => {
    const list = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    const booking = list.body.data[0];
    const res = await request(app)
      .patch(`/api/v1/admin/booking/${booking.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ additionalNotes: 'Please handle with care', weight: booking.weight ?? 2, assignedToId: staff.id });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', booking.id);
    expect(res.body.data.assignedTo).toBeDefined();
  });
});
