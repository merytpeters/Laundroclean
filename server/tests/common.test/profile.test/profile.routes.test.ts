import request from 'supertest';
import { jest } from '@jest/globals';
import prisma from '../../../src/config/prisma';
import AuthUtils from '../../../src/modules/auth/auth.utils';
import { UserType } from '@prisma/client';
import tokenService from '../../../src/modules/token/token.service';
const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

describe('Profile Routes (integration)', () => {
  let user: any;
  let token: string;
  let appInstance: any;

  beforeAll(async () => {
    jest.resetModules();
    // isolate modules so we can mock MediaService only for this test
    jest.unstable_mockModule('cloudinary', () => ({
      v2: {
        config: jest.fn(),
        uploader: {
          upload_stream: jest.fn((options, cb: (err: null, result: any) => void) => {
            cb(null, {
              secure_url: 'http://mocked.url/avatar.jpg',
              public_id: 'mock_public_id'
            });
          }),
          destroy: jest.fn(() => Promise.resolve({ result: 'ok' }))
        }
      }
    }));

    const appModule = await import('../../../src/app');
    appInstance = appModule.default;

    // create a user and profile in the test DB
    const email = uniqueEmail('profile');
    const password = 'Password123!';
    user = await prisma.user.create({
      data: {
        email,
        password: await AuthUtils.hashPassword(password),
        type: UserType.CLIENT,
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id,
        avatarUrl: null,
        phoneNumber: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        postalCode: null,
        paymentMethodToken: null,
      },
    });

    token = await tokenService.createAccessToken(user.id);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'profile-' } } });
    await prisma.$disconnect();
  });

  it('GET /api/v1/profile returns profile', async () => {
    const res = await request(appInstance).get('/api/v1/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data.user.id', user.id);
  });

  it('PATCH /api/v1/profile updates profile', async () => {
    const payload = { phoneNumber: '123' };
    const res = await request(appInstance).patch('/api/v1/profile').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data.phoneNumber', '123');
  });

    it('PATCH /api/v1/profile/change-password changes password', async () => {
        const res = await request(appInstance)
            .patch('/api/v1/profile/change-password')
            .set('Authorization', `Bearer ${token}`)
            .send({
            currentPassword: 'Password123!',
            newPassword: 'NewPassword123!'
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
    });


  it('PATCH /api/v1/profile/pic uploads profile pic (mocked Cloudinary)', async () => {
    const res = await request(appInstance)
      .patch('/api/v1/profile/pic')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', Buffer.from('x'), 'avatar.png');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data.avatarUrl');
  });

  it('DELETE /api/v1/profile/pic deletes profile pic (mocked Cloudinary)', async () => {
    const res = await request(appInstance).delete('/api/v1/profile/pic').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
