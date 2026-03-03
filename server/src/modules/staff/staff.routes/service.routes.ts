import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import LaundrocleanservicesController from '../../laundrocleanservices/service.controller.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

router.post(
    '/services',
    UserAuth.requirePermission('service:create'),
    LaundrocleanservicesController.companyCreateServiceController
);

router.patch(
    '/services/:serviceId',
    UserAuth.requirePermission('service:update'),
    LaundrocleanservicesController.companyUpdateServiceController
);

router.get(
    '/services/:serviceId',
    UserAuth.requirePermission('service:view'),
    LaundrocleanservicesController.getActiveServiceById
);

router.get(
    '/services',
    UserAuth.requirePermission('service:view'),
    LaundrocleanservicesController.searchActiveServices,
);


export default router;