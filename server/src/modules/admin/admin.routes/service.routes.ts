import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import { LaundrocleanservicesController } from '../../laundrocleanservices/index.js';

const router = Router();

router.use(UserAuth.requireAdmin());

router.get(
    '/services/all-services/:serviceId',
    LaundrocleanservicesController.companyGetServiceById
);

router.get(
    '/services/all-services',
    LaundrocleanservicesController.companySearchAllServices
);

// Soft delete single
router.patch(
    '/services/all-services/:serviceId',
    LaundrocleanservicesController.companySoftDeleteServices
);

// Soft delete multiple
router.patch(
    '/services/all-services',
    LaundrocleanservicesController.companySoftDeleteServices
);

// Restore single
router.patch(
    '/services/all-services/:serviceId/restore',
    LaundrocleanservicesController.companyRestoreService
);

// Restore multiple
router.patch(
    '/services/all-services/restore',
    LaundrocleanservicesController.companyRestoreManyServices
);

export default router;