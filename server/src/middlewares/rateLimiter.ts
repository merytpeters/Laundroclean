import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Options } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import type { Request } from 'express';
import config from '../config/config.js';
import { getRedis } from './redis.js';

const makeStore = (prefix: string) => {
  // In test environment we avoid using Redis and let the in-memory store be used
  if (config.NODE_ENV === 'test') return undefined as any;

  // Also avoid using Redis in CI environments (GitHub Actions, other CI)
  // to prevent constructing Redis-backed stores during CI runs where
  // Redis may be unavailable.
  if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') return undefined as any;

  try {
    const redis = getRedis();
    if (!redis) throw new Error('Redis client not available');

    return new RedisStore({
      sendCommand: (...args: string[]) => {
        const fn = redis.call as unknown as (
          ...a: [string, ...(string | number | Buffer<ArrayBufferLike>)[]]
        ) => any;
        return fn.apply(redis, args as unknown as [string, ...(string | number | Buffer<ArrayBufferLike>)[]]) as any;
      },
      prefix: `rl:${prefix}:`,
    });
  } catch (err) {
    // if Redis or RedisStore cannot be used in this environment (CI/test without redis),
    // fall back to the default in-memory store so tests run reliably.
    // suppress noisy warnings in CI/tests
    return undefined as any;
  }
};

const keyResolver = (req: Request): string => {
  const userId = (req as any).user?.id;
  if (userId) return `user:${userId}`;
  // use express-rate-limit's helper to handle IPv6 correctly
  const ipKey = (ipKeyGenerator as unknown as (r: Request) => string)(req);
  return `ip:${ipKey}`;
};

const routeLimiter = (prefix: string, opts: Partial<Options>) => {
  const retryAfterSec = opts.windowMs ? Math.ceil((opts.windowMs as number) / 1000) : undefined;
  return rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: makeStore(prefix),
    keyGenerator: keyResolver,
    message: { error: 'Rate limit exceeded', retryAfter: retryAfterSec },
    ...opts,
   });
};

export const globalLimiter = rateLimit({
  windowMs: config.RL_GLOBAL_WINDOW_MS,
  max: config.RL_GLOBAL_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: makeStore('global'),
  keyGenerator: keyResolver,
  message: { error: 'Too many requests', retryAfter: Math.ceil(config.RL_GLOBAL_WINDOW_MS / 1000) },
});

export const bookingLimiter = routeLimiter('booking', {
  windowMs: config.RL_BOOKING_WINDOW_MS,
  max: config.RL_BOOKING_MAX,
});

export const authLimiter = routeLimiter('auth', {
  windowMs: config.RL_AUTH_WINDOW_MS,
  max: config.RL_AUTH_MAX,
  skipSuccessfulRequests: true,
});

// Helper to clear rate limit keys used by the stores (useful for tests)
export const resetRateLimit = async (prefix?: string) => {
  // Avoid attempting Redis operations in test CI where Redis may be unavailable.
  if (config.NODE_ENV === 'test') return;

  const redis = getRedis();
  if (!redis) return;

  try {
    const pattern = prefix ? `rl:${prefix}:*` : 'rl:*';
    // collect keys using SCAN to avoid blocking Redis on large datasets
    const keys: string[] = [];
    let cursor = '0';
    do {
      const res = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
      // res is [cursor, keys[]]
      // @ts-ignore
      cursor = res[0];
      // @ts-ignore
      const found: string[] = res[1] || [];
      keys.push(...found);
    } while (cursor !== '0');

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    // swallow errors to avoid noisy warnings in CI
  }
};

// Close the internal Redis client used by the rate limiter (tests/global teardown)
export const closeRateLimiter = async () => {
  try {
    const redis = getRedis();
    // prefer graceful quit
    if (redis && typeof redis.quit === 'function') {
      await redis.quit();
    } else if (redis && typeof redis.disconnect === 'function') {
      redis.disconnect();
    }
  } catch (err) {
    // ignore close errors
  }
};