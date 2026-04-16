import { resetRateLimit } from '../src/middlewares/rateLimiter';

// Jest's setupFilesAfterEnv runs in each test environment. Use the global
// `beforeEach` to clear rate limiter keys so test suites don't collide on
// rate limit counters.
beforeEach(async () => {
  try {
    await resetRateLimit();
  } catch (err) {
     
    console.warn('resetRateLimit failed in Jest setup:', err?.message || err);
  }
});
