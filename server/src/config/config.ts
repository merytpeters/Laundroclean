const env = (variable: string): any => {
    if (variable === 'PORT') return process.env.PORT || '3000';

    if (process.env.NODE_ENV === 'test') {
      if (variable === 'JWT_SECRET') return 'test_jwt_secret';
    }
    const value = process.env[variable];

    if (!value) throw new Error(`${variable} not set in ENV`);
    return value;
};

const config = {
  NODE_ENV: env('NODE_ENV'),
  PORT: env('PORT'),
  JWT_SECRET: env('JWT_SECRET')
};

export default config;