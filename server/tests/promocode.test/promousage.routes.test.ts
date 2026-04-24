import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';
import AuthUtils from '../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';

describe('Admin PromoUsage Routes', () => {
  let adminToken: string;
  let service: any;
  let promo: any;
  let user: any;
  let usage: any;

  beforeAll(async () => {
    // clean dependent tables to avoid FK constraint issues
    await prisma.bookingNotifications.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.staffCalendar.deleteMany();
    await prisma.servicePrice.deleteMany();
    await prisma.promoUsage.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.service.deleteMany();
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();

    const adminRole = await prisma.companyRoleTitle.create({ data: { title: 'ADMIN', level: 10, permissions: ['*'] } });
    const admin = await prisma.user.create({ data: { email: 'admin-promousage@test.com', password: await AuthUtils.hashPassword('AdminPass123!'), type: UserType.COMPANYUSER, role: { connect: { id: adminRole.id } }, isActive: true } });

    service = await prisma.service.create({ data: { name: `PromUsageSvc_${Date.now()}`, description: 'promousage route tests' } });
    promo = await prisma.promoCode.create({ data: { code: 'ROUTETEST', serviceId: service.id, type: 'FIXED_AMOUNT', value: 100, isActive: true } });

    user = await prisma.user.create({ data: { email: 'client-promousage@test.com', password: await AuthUtils.hashPassword('ClientPass123!'), type: UserType.CLIENT } });
    usage = await prisma.promoUsage.create({ data: { userId: user.id, promoCodeId: promo.id, timesUsed: 1 } });

    const res = await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'AdminPass123!' });
    adminToken = res.body?.data?.accessToken ?? res.body?.accessToken ?? res.body?.token;
  });

  afterAll(async () => {
    await prisma.promoUsage.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.service.deleteMany();
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();
    await prisma.$disconnect();
  });

  it('GET /api/v1/admin/promousages should list promo usages', async () => {
    const res = await request(app).get('/api/v1/admin/promousages').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find((u: any) => u.id === usage.id);
    expect(found).toBeDefined();
    expect(found).toHaveProperty('userId', user.id);
  });

  it('GET /api/v1/admin/promousages/:id should return usage details', async () => {
    const res = await request(app).get(`/api/v1/admin/promousages/${usage.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', usage.id);
    expect(res.body.data).toHaveProperty('promoCodeId', promo.id);
  });

  it('GET /api/v1/admin/promousages/user should return usage for user and promo', async () => {
    const res = await request(app)
      .get('/api/v1/admin/promousages/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ userId: user.id, promoCodeId: promo.id });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('userId', user.id);
    expect(res.body.data).toHaveProperty('promoCodeId', promo.id);
  });

  it('DELETE /api/v1/admin/promousages/:id should remove the usage', async () => {
    const res = await request(app).delete(`/api/v1/admin/promousages/${usage.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    const list = await request(app).get('/api/v1/admin/promousages').set('Authorization', `Bearer ${adminToken}`);
    const found = (list.body.data || []).find((u: any) => u.id === usage.id);
    expect(found).toBeUndefined();
  });
});

export {};
