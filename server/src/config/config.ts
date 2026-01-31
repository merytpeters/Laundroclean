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
};

export default config;