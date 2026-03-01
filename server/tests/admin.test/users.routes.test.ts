import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Admin Users Routes', () => {
  let adminToken: string;
  let adminRole: any;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.companyRoleTitle.deleteMany();

    adminRole = await prisma.companyRoleTitle.upsert({
      where: { title: 'ADMIN' },
      update: { level: 10, permissions: ['*'] },
      create: { title: 'ADMIN', level: 10, permissions: ['*'] },
    });

    const _admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: await AuthUtils.hashPassword('AdminPassword123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
        profile: { create: {} },
      },
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'AdminPassword123!' });

    adminToken =
      response.body?.data?.accessToken ?? response.body?.accessToken ?? response.body?.token ?? response.body?.access_token;

    if (!adminToken) throw new Error('Failed to obtain admin token');

    // create sample users for tests
    const users = [
      { email: 'client.active@example.com', type: UserType.CLIENT, isActive: true },
      { email: 'client.inactive@example.com', type: UserType.CLIENT, isActive: false },
      { email: 'company.active@example.com', type: UserType.COMPANYUSER, isActive: true },
      { email: 'company.inactive@example.com', type: UserType.COMPANYUSER, isActive: false },
    ];

    for (const u of users) {
      await prisma.user.create({
        data: {
          email: u.email,
          password: await AuthUtils.hashPassword('Password123!'),
          type: u.type,
          isActive: u.isActive,
          profile: { create: {} },
        },
      });
    }

    // additional users to validate pagination
    for (let i = 0; i < 5; i++) {
      await prisma.user.create({
        data: {
          email: `paginated${i}@example.com`,
          password: await AuthUtils.hashPassword('Password123!'),
          type: UserType.CLIENT,
          isActive: true,
          profile: { create: {} },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('allows admin to get a user profile', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'client.active@example.com' } });
    const res = await request(app).get(`/api/v1/admin/users/${user?.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data.user.email', 'client.active@example.com');
  });

  it('searches users by status (active)', async () => {
    const res = await request(app).get('/api/v1/admin/users').query({ status: 'active' }).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.every((p: any) => p.user.isActive === true)).toBe(true);
  });

  it('filters users by type (client)', async () => {
    const res = await request(app).get('/api/v1/admin/users').query({ type: 'client' }).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.user.type === 'CLIENT')).toBe(true);
  });

  it('filters by combination (inactive company)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .query({ status: 'inactive', type: 'company' })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.user.isActive === false && p.user.type === 'COMPANYUSER')).toBe(true);
  });

  it('paginates results', async () => {
    const res = await request(app).get('/api/v1/admin/users').query({ limit: 2, page: 2 }).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it('lets admin set a user active status', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'company.active@example.com' } });
    const res = await request(app)
      .patch(`/api/v1/admin/users/${user?.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });
    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });
});
