import request from 'supertest';
import createApp from './rateLimiter.routes';
import config from '../../src/config/config';
import { getRedis } from '../../src/middlewares/redis';

describe('Rate limiter middlewares', () => {
  const app = createApp();
  const redis = getRedis();

  beforeAll(async () => {
    // clear redis keys used by rate limiter to ensure clean slate
    try {
      if (redis) {
        await redis.flushdb();
      }
    } catch (err) {
      // if redis not available tests may still run against memory; let failures surface
      // but swallow error here to avoid crashing before tests
       
      console.warn('Redis flush failed (tests may be flaky):', (err as Error).message || err);
    }
  });

  afterAll(async () => {
    if (redis) {
      await redis.disconnect();
    }
  });

  it('authLimiter should block after configured max failed attempts', async () => {
    const max = config.RL_AUTH_MAX;
    const url = '/test/auth/login';

    for (let i = 0; i < max; i++) {
      const res = await request(app).post(url).send({ email: 'noone@example.test', password: 'bad' });
      // expecting non-429 (401/400) until limit reached
      expect(res.status).not.toBe(429);
    }

    const blocked = await request(app).post(url).send({ email: 'noone@example.test', password: 'bad' });
    expect(blocked.status).toBe(429);
    expect(blocked.body).toHaveProperty('error');
    expect(blocked.body.error).toBe('Rate limit exceeded');
    // retryAfter should be in seconds
    expect(blocked.body).toHaveProperty('retryAfter');
    expect(typeof blocked.body.retryAfter === 'number' || typeof blocked.body.retryAfter === 'string').toBe(true);
  });

  it('bookingLimiter should block after configured max requests', async () => {
    const max = config.RL_BOOKING_MAX;
    const url = '/test/booking';

    for (let i = 0; i < max; i++) {
      const res = await request(app).post(url).send({});
      expect(res.status).not.toBe(429);
      expect(res.status).toBe(201);
    }

    const blocked = await request(app).post(url).send({});
    expect(blocked.status).toBe(429);
    expect(blocked.body).toHaveProperty('error', 'Rate limit exceeded');
    expect(blocked.body).toHaveProperty('retryAfter');
  });
});
