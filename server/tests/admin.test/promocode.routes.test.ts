import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Admin Promocode Routes', () => {
  let adminToken: string;
  let serviceId: string;

  beforeAll(async () => {
    // clean dependent data
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
    await prisma.promoCode.deleteMany();

    const adminRole = await prisma.companyRoleTitle.upsert({
      where: { title: 'ADMIN' },
      update: { level: 10, permissions: ['*'] },
      create: { title: 'ADMIN', level: 10, permissions: ['*'] },
    });

    const _admin = await prisma.user.create({
      data: {
        email: 'admin-promocode@test.com',
        password: await AuthUtils.hashPassword('AdminPassword123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
      },
    });

    const response = await request(app).post('/api/v1/auth/login').send({ email: 'admin-promocode@test.com', password: 'AdminPassword123!' });
    adminToken = response.body?.data?.accessToken ?? response.body?.accessToken ?? response.body?.token ?? response.body?.access_token;
    if (!adminToken) throw new Error('Failed to obtain admin token');

    // create a service to attach promos to
    const svc = await prisma.service.create({ data: { name: `PromoService_${Date.now()}`, description: 'Service for promo tests' } });
    serviceId = svc.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow admin to create a promo code', async () => {
    const code = `SPRING_${Date.now()}`;
    const res = await request(app)
      .post('/api/v1/admin/promocodes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ code, serviceId, type: 'PERCENTAGE', value: 10 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data.promo.code', code.toUpperCase());
  });

  it('should list promos and allow get, update and delete', async () => {
    // create another promo
    const createRes = await request(app)
      .post('/api/v1/admin/promocodes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ code: 'TEMPTEST', serviceId, type: 'FIXED_AMOUNT', value: 500 });

    expect(createRes.status).toBe(201);
    const promo = createRes.body?.data?.promo;
    expect(promo).toBeDefined();

    // list
    const listRes = await request(app).get('/api/v1/admin/promocodes').set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body?.data?.promos) || Array.isArray(listRes.body?.data)).toBeTruthy();

    // get by id
    const getRes = await request(app).get(`/api/v1/admin/promocodes/${promo.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('data.promo.id', promo.id);

    // update
    const patchRes = await request(app)
      .patch(`/api/v1/admin/promocodes/${promo.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Updated desc' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toHaveProperty('data.promo.description', 'Updated desc');

    // delete (deactivate)
    const delRes = await request(app).delete(`/api/v1/admin/promocodes/${promo.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body).toHaveProperty('success', true);
  });
});

export {};
