import express from 'express';
import validate from '../../middlewares/validate.js';
import PromoController from './promo.controller.js';
import { PromoValidation } from '../../validation/index.js';

const router = express.Router();

// Public endpoint to validate/preview a promo for a service
router.get('/validate', validate(PromoValidation.promoCheck, 'query'), PromoController.validatePromo);

export default router;
