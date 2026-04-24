import express from 'express';
import UserAuth from '../../../../middlewares/auth.js';
import PromoUsageController from '../../../promocode/promousage.controller.js';

const router = express.Router();

router.use(UserAuth.requireCompanyAdmin());

router.get('/promousages', PromoUsageController.list);
router.get('/promousages/user', PromoUsageController.getForUser);
router.get('/promousages/:id', PromoUsageController.get);
router.delete('/promousages/:id', PromoUsageController.remove);

export default router;
