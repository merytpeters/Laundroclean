import express from 'express';
import bodyParser from 'body-parser';
import { authLimiter, bookingLimiter } from '../../src/middlewares/rateLimiter';

const createApp = () => {
  const app = express();
  app.use(bodyParser.json());

  // auth endpoints — simulate failing/successful responses so limiter counts appropriately
  app.post('/test/auth/login', authLimiter, (_req, res) => res.status(401).json({ error: 'invalid' }));
  app.post('/test/auth/forgot-password', authLimiter, (_req, res) => res.status(400).json({ error: 'invalid' }));
  app.post('/test/auth/register', authLimiter, (_req, res) => res.status(400).json({ error: 'invalid' }));

  // booking endpoint — simulate a successful booking creation
  app.post('/test/booking', bookingLimiter, (_req, res) => res.status(201).json({ ok: true }));

  return app;
};

export default createApp;
