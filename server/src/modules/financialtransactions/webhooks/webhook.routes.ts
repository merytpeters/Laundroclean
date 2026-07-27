import express from 'express';
import webhookController from './webhook.controller.js';

const router = express.Router();

router.post(
  '/opay',
  webhookController.opayWebhookController
);

export default router;