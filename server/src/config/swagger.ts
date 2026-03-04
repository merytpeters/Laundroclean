import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';
import config from './config.js';

const isProduction = config.NODE_ENV === 'production';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LaundroClean',
      version: '1.0.0',
      description: 'API documentation for LaundroClean',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: isProduction
    ? ['dist/modules/**/*.docs.js', 'dist/modules/**/*.docs.*.js']
    : ['src/modules/**/*.docs.ts', 'src/modules/**/*.docs.*.ts'],
  
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
