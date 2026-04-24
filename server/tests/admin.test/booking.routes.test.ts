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
    await prisma.timeSlot.deleteMany();
    await prisma.staffCalendar.deleteMany();
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
    // create a promo for the service
    await prisma.promoCode.create({
      data: { code: 'ADMINPROMO', serviceId: service.id, type: 'PERCENTAGE', value: 10, isActive: true },
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
    await prisma.promoUsage.deleteMany();
    await prisma.promoCode.deleteMany();
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

  it('POST /api/v1/admin/booking should create a booking for a client with a promo code', async () => {
    const payload = {
      email: client.email,
      profileId: clientProfile.id,
      deliveryType: 'PICK_UP',
      serviceId: service.id,
      weight: 2,
      promoCode: 'ADMINPROMO'
    };

    const res = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    const booking = res.body.data;
    expect(booking).toHaveProperty('serviceId', service.id);
    expect(booking).toHaveProperty('promoCodeId');
    expect(booking).toHaveProperty('discountAmount');
    expect(booking.promoCodeId).toBeTruthy();

    const promo = await prisma.promoCode.findUnique({ where: { code: 'ADMINPROMO' } });
    expect(promo).toBeTruthy();
    expect(booking.promoCodeId).toBe(promo!.id);

    const usage = await prisma.promoUsage.findFirst({ where: { promoCodeId: promo!.id, userId: client.id } });
    expect(usage).toBeNull();
  });

  it('GET /api/v1/admin/bookings should list bookings', async () => {
    const res = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    const bookings = res.body.data;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    await prisma.promoUsage.deleteMany();
    await prisma.promoCode.deleteMany();
    expect(Array.isArray(res.body.data)).toBe(true);
    bookings.forEach((b: any) => {
      expect(b).toHaveProperty('assignedTo');
      if (b.assignedTo !== null) {
        expect(b.assignedTo.id).toBeDefined();
      }
    });
  });

  it('GET /api/v1/admin/bookings/:bookingId should return booking details', async () => {
    const list = await request(app).get('/api/v1/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    const booking = list.body.data[0];
    const res = await request(app).get(`/api/v1/admin/bookings/${booking.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', booking.id);
    expect(res.body.data.assignedTo).toBeDefined();
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

  it('Admin can set maxDailyBookings and booking is limited per day', async () => {
    // create a separate admin user and service with a daily limit
    let adminRole2 = await prisma.companyRoleTitle.findUnique({ where: { title: 'ADMIN' } });
    if (!adminRole2) {
      adminRole2 = await prisma.companyRoleTitle.create({ data: { title: 'ADMIN', level: 10, permissions: ['*'] } });
    }
    const admin2 = await prisma.user.create({ data: { email: 'admin-limit@test.com', password: await AuthUtils.hashPassword('AdminPass123!'), type: 'COMPANYUSER', role: { connect: { id: adminRole2.id } }, isActive: true } });

    const client2 = await prisma.user.create({ data: { email: 'client-limit@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: 'CLIENT' } });
    const clientProfile2 = await prisma.profile.create({ data: { userId: client2.id, phoneNumber: '0800000099' } });

    const serviceWithLimit = await prisma.service.create({ data: { name: 'LimitService', description: 'Service with limit', maxDailyBookings: 1 } });
    await prisma.servicePrice.create({ data: { serviceId: serviceWithLimit.id, amount: '100', currency: 'NAIRA', pricingType: 'PER_KG', isActive: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: admin2.email, password: 'AdminPass123!' });
    const admin2Token = loginRes.body?.data?.accessToken ?? loginRes.body?.accessToken ?? loginRes.body?.token;

    const payload = {
      email: client2.email,
      profileId: clientProfile2.id,
      deliveryType: 'PICK_UP',
      serviceId: serviceWithLimit.id,
      weight: 2,
    };

    const r1 = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${admin2Token}`).send(payload);
    expect(r1.status).toBe(201);

    const r2 = await request(app).post('/api/v1/admin/booking').set('Authorization', `Bearer ${admin2Token}`).send(payload);
    expect(r2.status).toBe(409);
    expect(r2.body).toHaveProperty('success', false);
    expect(r2.body.message).toMatch(/Daily booking limit reached/i);
  });
});
