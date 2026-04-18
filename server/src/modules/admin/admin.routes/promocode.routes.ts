import express from 'express';
import validate from '../../../middlewares/validate.js';
import UserAuth from '../../../middlewares/auth.js';
import { PromoValidation } from '../../../validation/index.js';
import { PromoController } from '../../promocode/index.js';

const router = express.Router();

router.use(UserAuth.requireCompanyAdmin());

router.post('/promocodes', validate(PromoValidation.promoCreate), PromoController.createPromo);
router.get('/promocodes', PromoController.getPromos);
router.get('/promocodes/:id', PromoController.getPromo);
router.patch('/promocodes/:id', validate(PromoValidation.promoUpdate), PromoController.updatePromo);
router.delete('/promocodes/:id', PromoController.deletePromo);

export default router;
