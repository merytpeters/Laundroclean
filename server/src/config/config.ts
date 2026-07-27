import 'dotenv/config';
import type { string } from 'zod';

const env = (variable: string, defaultValue?: string): any => {
  if (variable === 'PORT') return process.env.PORT || '3000';

  const nodeEnv = process.env.NODE_ENV || 'development';

  if (['test', 'development'].includes(nodeEnv)) {
    switch (variable) {
      case 'JWT_SECRET': return 'dev_jwt_secret';
      case 'REFRESH_TOKEN_EXPIRES': return '7d';
      case 'ACCESS_TOKEN_EXPIRES': return '30m';
      case 'ADMIN_EMAIL': return 'admin@dev.local';
      case 'ADMIN_PASSWORD': return 'Admin123!';
      case 'TEMPLATES_PATH': return 'src/modules/emailService/templates';
      case 'RESEND_API_KEY':
        if (!process.env.RESEND_API_KEY) {
          if (nodeEnv === 'test') return 'mock_resend';
          throw new Error('RESEND_API_KEY not set in ENV');
        }
        return process.env.RESEND_API_KEY;
      case 'RESET_TOKEN_EXPIRES': return '60m';
      case 'CLIENT_URL': return nodeEnv === 'test' ? 'http://localhost:3000' : 'http://localhost:3000';
      case 'APP_NAME': return 'LaundroClean';
      case 'CLOUDINARY_URL': 
        if (!process.env.CLOUDINARY_URL) {
          if (nodeEnv === 'test') return 'mock_cloudinary';
          throw new Error('CLOUDINARY_URL not set in ENV');
        }
        return process.env.CLOUDINARY_URL;
      case 'ADMIN_ROLE_LEVEL': return 10;
      case 'GEOCODER_USER_AGENT': return 'Laundrocleantestmap';
      case 'APP_VERSION': return '1.0.0';
      case 'REDIS_URL': return 'redis://localhost:6379';
      case 'RL_GLOBAL_WINDOW_MS': return 900000;
      case 'RL_GLOBAL_MAX': return nodeEnv === 'test' ? 1000000 : 100;
      case 'RL_BOOKING_WINDOW_MS': return 60000;
      case 'RL_BOOKING_MAX': return 5;
      case 'RL_AUTH_WINDOW_MS': return 900000;
      case 'RL_AUTH_MAX': return 10;
      // case 'RL_MACHINE_WINDOW_MS': return 60000
      // case 'RL_MACHINE_MAX': return 30
      // case 'RL_PAYMENT_WINDOW_MS': return 300000
      // case 'RL_PAYMENT_MAX': return 3
      case 'ALLOWED_ORIGINS': return 'http://localhost:3000';
      case 'OPAY_WEBHOOK_SECRET': return 'my-OPAY_WEBHOOK_SECRET';
      case 'WEBHOOK_URL': return 'test-value-for-now';
      case 'PAYMENT_REDIRECT_URL': return 'test-value-for-now';
      case 'OPAY_MERCHANT_ID': return 'test-value-for-now';
      case 'OPAY_PRIVATE_KEY': return 'test-value-for-now';
      case 'OPAY_URL': return 'test-value-for-now';
    }
  }

  const value = process.env[variable] ?? defaultValue;

  if (!value) throw new Error(`${variable} not set in ENV`);
  return value;
};

const config = {
  NODE_ENV: env('NODE_ENV', 'development'),
  PORT: env('PORT'),
  JWT_SECRET: env('JWT_SECRET'),
  REFRESH_TOKEN_EXPIRES: env('REFRESH_TOKEN_EXPIRES'),
  ACCESS_TOKEN_EXPIRES: env('ACCESS_TOKEN_EXPIRES'),
  ADMIN_PASSWORD: env('ADMIN_PASSWORD'),
  ADMIN_EMAIL: env('ADMIN_EMAIL'),
  TEMPLATES_PATH: env('TEMPLATES_PATH'),
  RESEND_API_KEY: env('RESEND_API_KEY'),
  APP_NAME: env('APP_NAME'),
  CLIENT_URL: env('CLIENT_URL'),
  RESET_TOKEN_EXPIRES: env('RESET_TOKEN_EXPIRES'),
  CLOUDINARY_URL: env('CLOUDINARY_URL'),
  ADMIN_ROLE_LEVEL: Number(env('ADMIN_ROLE_LEVEL')),
  GEOCODER_USER_AGENT: env('GEOCODER_USER_AGENT'),
  APP_VERSION: Number(env('APP_VERSION')),
  REDIS_URL: env('REDIS_URL'),
  RL_GLOBAL_WINDOW_MS: Number(env('RL_GLOBAL_WINDOW_MS')),
  RL_GLOBAL_MAX: Number(env('RL_GLOBAL_MAX')),
  RL_BOOKING_WINDOW_MS: Number(env('RL_BOOKING_WINDOW_MS')),
  RL_BOOKING_MAX: Number(env('RL_BOOKING_MAX')),
  // RL_MACHINE_WINDOW_MS: Number(env('RL_MACHINE_WINDOW_MS')),
  // RL_MACHINE_MAX: Number(env('RL_MACHINE_MAX')),
  // RL_PAYMENT_WINDOW_MS: Number(env('RL_PAYMENT_WINDOW_MS')),
  // RL_PAYMENT_MAX: Number(env('RL_PAYMENT_MAX')),
  RL_AUTH_WINDOW_MS: Number(env('RL_AUTH_WINDOW_MS')),
  RL_AUTH_MAX: Number(env('RL_AUTH_MAX')),
  ALLOWED_ORIGINS: env('ALLOWED_ORIGINS')
    ? env('ALLOWED_ORIGINS').split(',').map((url: string) => url.trim())
    : ['http://localhost:3000'],
  OPAY_WEBHOOK_SECRET: env('OPAY_WEBHOOK_SECRET'),
  WEBHOOK_URL: env('WEBHOOK_URL'),
  PAYMENT_REDIRECT_URL: env('PAYMENT_REDIRECT_URL'),
  OPAY_MERCHANT_ID: env('OPAY_MERCHANT_ID'),
  OPAY_PRIVATE_KEY: env('OPAY_PRIVATE_KEY'),
  OPAY_URL: env('OPAY_URL')
};

export default config;