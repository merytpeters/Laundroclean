import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';

describe('Client Booking Routes', () => {
  let clientToken: string;
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
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();

    // create client
    client = await prisma.user.create({
      data: { email: 'client-int@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: UserType.CLIENT },
    });

    clientProfile = await prisma.profile.create({ data: { userId: client.id, phoneNumber: '0800000001' } });

    service = await prisma.service.create({ data: { name: 'DryClean', description: 'Dry clean' } });
    _servicePrice = await prisma.servicePrice.create({
      data: { serviceId: service.id, amount: '150', currency: 'NAIRA', pricingType: 'PER_KG', isActive: true },
    });

    const res = await request(app).post('/api/v1/auth/login').send({ email: client.email, password: 'ClientPass123!' });
    clientToken = res.body?.data?.accessToken ?? res.body?.accessToken ?? res.body?.token;
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

  it('POST /api/v1/client/booking should let client create a booking', async () => {
    const payload = {
      profileId: clientProfile.id,
      deliveryType: 'PICK_UP',
      serviceId: service.id,
      weight: 3,
      scheduledDate: '2026-04-14T10:00:00Z',
      pickupTime: '2026-04-23T10:00:00Z'
    };

    const res = await request(app).post('/api/v1/client/booking').set('Authorization', `Bearer ${clientToken}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('GET /api/v1/client/bookings should list client bookings', async () => {
    const res = await request(app).get('/api/v1/client/bookings').set('Authorization', `Bearer ${clientToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('PATCH /api/v1/client/bookings/:bookingId should update client booking', async () => {
    const list = await request(app).get('/api/v1/client/bookings').set('Authorization', `Bearer ${clientToken}`);
    const booking = list.body.data[0];
    const res = await request(app)
      .patch(`/api/v1/client/bookings/${booking.id}`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ additionalNotes: 'Client note', weight: booking.weight ?? 3 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', booking.id);
  });
});
