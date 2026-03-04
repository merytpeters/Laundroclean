import { Router } from 'express';
import UserAuth from '../../middlewares/auth.js';
import ServicepriceController from './serviceprice.controller.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

router.post(
  '/:serviceId',
  UserAuth.requirePermission(PERMISSIONS.SERVICEPRICE.CREATE),
  ServicepriceController.companyCreateServicePriceController
);

export default router;
