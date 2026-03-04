import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import LaundrocleanservicesController from '../../laundrocleanservices/service.controller.js';
import { ServiceValidation } from '../../../validation/index.js';
import validate from '../../../middlewares/validate.js';
import { PERMISSIONS } from '../../../constants/permissions.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

router.post(
    '/services',
    validate(ServiceValidation.serviceSchema),
    UserAuth.requirePermission(PERMISSIONS.SERVICE.CREATE),
    LaundrocleanservicesController.companyCreateServiceController
);

router.patch(
    '/services/:serviceId',
    validate(ServiceValidation.updateServiceSchema),
    UserAuth.requirePermission(PERMISSIONS.SERVICE.UPDATE),
    LaundrocleanservicesController.companyUpdateServiceController
);

router.get(
    '/services/:serviceId',
    UserAuth.requirePermission(PERMISSIONS.SERVICE.VIEW),
    LaundrocleanservicesController.getActiveServiceById
);

router.get(
    '/services',
    UserAuth.requirePermission(PERMISSIONS.SERVICE.VIEW),
    LaundrocleanservicesController.searchActiveServices,
);


export default router;