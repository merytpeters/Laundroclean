const env = (variable: string): any => {
    const value = process.env[variable];

    if (!value) throw new Error(`${variable} not set in ENV`);
    return value;
};

const config = {
  NODE_ENV: env('NODE_ENV'),
  PORT: env('PORT'),
};

export default config;