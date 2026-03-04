import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('ServicePrice Routes', () => {
  let adminToken: string;
  let adminRole: any;
  let service: any;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();
    await prisma.servicePrice.deleteMany();
    await prisma.service.deleteMany();

    adminRole = await prisma.companyRoleTitle.upsert({
      where: { title: 'ADMIN' },
      update: { level: 10, permissions: ['*'] },
      create: { title: 'ADMIN', level: 10, permissions: ['*'] },
    });

    const _admin = await prisma.user.create({
      data: {
        email: 'admin@serviceprice.test',
        password: await AuthUtils.hashPassword('AdminPassword123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
      },
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@serviceprice.test',
      password: 'AdminPassword123!',
    });

    adminToken =
      response.body?.data?.accessToken ??
      response.body?.accessToken ??
      response.body?.token ??
      response.body?.access_token;

    if (!adminToken) {
      throw new Error('Failed to obtain admin access token: ' + JSON.stringify(response.body));
    }

    service = await prisma.service.create({ data: { name: 'Route Service', description: 'for routes test' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/service-price/:serviceId', () => {
    it('allows admin to create a service price', async () => {
      const response = await request(app)
        .post(`/api/v1/service-price/${service.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: '15', currency: 'DOLLAR', pricingType: 'FLAT_RATE' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data.serviceId', service.id);
      expect(response.body).toHaveProperty('data.currency', 'DOLLAR');
    });
  });
});
