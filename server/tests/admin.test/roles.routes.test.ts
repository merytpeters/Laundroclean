import { UserType } from '@prisma/client';
import AuthUtils from '../../src/modules/auth/auth.utils';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Roles Routes', () => {
  let adminToken: string;

  beforeAll(async () => {
    // ensure clean slate for users and role titles from previous runs
    await prisma.user.deleteMany();

    const adminRole = await prisma.companyRoleTitle.upsert({
      where: { title: 'ADMIN' },
      update: { level: 10, permissions: ['*'] },
      create: { title: 'ADMIN', level: 10, permissions: ['*'] },
    });


    const _admin = await prisma.user.create({
      data: {
        email: 'adminroles@example.com',
        password: await AuthUtils.hashPassword('AdminPassword123!'),
        type: UserType.COMPANYUSER,
        role: { connect: { id: adminRole.id } },
        isActive: true,
      },
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'adminroles@example.com', password: 'AdminPassword123!' });

    adminToken =
      response.body?.data?.accessToken ??
      response.body?.accessToken ??
      response.body?.token ??
      response.body?.access_token;

    if (!adminToken) {
      throw new Error('Failed to obtain admin access token from login response: ' + JSON.stringify(response.body));
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow admin to create a company role', async () => {
    const response = await request(app)
      .post('/api/v1/admin/company-roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Manager', level: 2, permissions: ['read'] });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data.role.title', 'MANAGER');
  });

  it('should list roles and return a specific role by id, update and delete it', async () => {
    // create a role
    const createRes = await request(app)
      .post('/api/v1/admin/company-roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'TempRole', level: 1 });

    expect(createRes.status).toBe(201);
    const role = createRes.body?.data?.role;
    expect(role).toBeDefined();

    // list
    const listRes = await request(app)
      .get('/api/v1/admin/company-roles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body?.data?.roles)).toBeTruthy();

    // get by id
    const getRes = await request(app)
      .get(`/api/v1/admin/company-roles/${role.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('data.role.id', role.id);

    // update
    const patchRes = await request(app)
      .patch(`/api/v1/admin/company-roles/${role.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'TempRoleUpdated' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toHaveProperty('data.role.title', 'TEMPROLEUPDATED');

    // delete
    const delRes = await request(app)
      .delete(`/api/v1/admin/company-roles/${role.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body).toHaveProperty('success', true);
  });
});
