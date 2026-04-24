import { Redis } from 'ioredis';
import config from '../config/config.js';

let redis: Redis | null = null;

export const getRedis = () => {
  if (!redis) {
    try {
      // Reduce retries; keep offline queue enabled so callers using
      // the client (e.g. rate limiter) won't throw when Redis is
      // temporarily unavailable.
      redis = new Redis(config.REDIS_URL as string, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: true,
      });
    } catch (err) {
      // If the client cannot be constructed, ensure we return null
      // and let callers handle the lack of Redis gracefully.
       
      console.warn('Failed to create Redis client:', (err instanceof Error ? err.message : String(err)) || err);
      redis = null;
    }
  }
  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    try {
      if (typeof redis.quit === 'function') await redis.quit();
      else if (typeof redis.disconnect === 'function') redis.disconnect();
    } catch {}
    redis = null;
  }
};
