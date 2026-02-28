import 'dotenv/config';

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
};

export default config;