import request from 'supertest';
import app from '../../src/app.js';
import 'dotenv/config';

describe('POST /api/auth/register', () => {
  it('registers a CLIENT user and returns tokens', async () => {
    const email = `client+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'CLIENT'
      });

    if (res.status !== 201) console.log('DEBUG CLIENT REGISTER RESPONSE', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.type).toBe('CLIENT');
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(typeof res.body.data.refreshToken).toBe('string');
  });

  it('registers a COMPANYUSER with ADMIN role', async () => {
    const email = `company-admin+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'COMPANYUSER',
        role: 'ADMIN'
      });

    if (res.status !== 201) console.log('DEBUG COMPANY REGISTER RESPONSE', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.type).toBe('COMPANYUSER');
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(typeof res.body.data.refreshToken).toBe('string');
  });

  it('registers a COMPANYUSER with STAFF role', async () => {
    const email = `company-staff+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'COMPANYUSER',
        role: 'STAFF'
      });

    if (res.status !== 201) console.log('DEBUG COMPANY STAFF REGISTER RESPONSE', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.type).toBe('COMPANYUSER');
    expect(res.body.data.user.role).toBe('STAFF');
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(typeof res.body.data.refreshToken).toBe('string');
  });

  it('registers a COMPANYUSER with CASHIER role', async () => {
    const email = `company-cashier+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'COMPANYUSER',
        role: 'CASHIER'
      });

    if (res.status !== 201) console.log('DEBUG COMPANY CASHIER REGISTER RESPONSE', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.type).toBe('COMPANYUSER');
    expect(res.body.data.user.role).toBe('CASHIER');
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(typeof res.body.data.refreshToken).toBe('string');
  });

  it('rejects CLIENT when role is ADMIN', async () => {
    const email = `client-badrole-admin+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'CLIENT',
        role: 'ADMIN'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('rejects CLIENT when role is STAFF', async () => {
    const email = `client-badrole-staff+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'CLIENT',
        role: 'STAFF'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('rejects CLIENT when role is CASHIER', async () => {
    const email = `client-badrole-cashier+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password1!',
        type: 'CLIENT',
        role: 'CASHIER'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('returns validation error when email already exists', async () => {
    const email = `dup+${Date.now()}@example.com`;
    const payload = { email, password: 'Password1!', type: 'CLIENT' };

    const first = await request(app).post('/api/auth/register').send(payload);
    if (first.status !== 201) console.log('DEBUG FIRST REGISTER RESPONSE', first.body);
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/auth/register').send(payload);
    expect(second.status).toBe(400);
    expect(second.body.success).toBe(false);
    expect(second.body.message).toBeDefined();
  });
});
