import { Redis } from 'ioredis';
import config from '../config/config.js';

let redis: Redis | null = null;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(config.REDIS_URL);
  }
  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};
