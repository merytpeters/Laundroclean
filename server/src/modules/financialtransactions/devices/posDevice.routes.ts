import { Router } from 'express';
import posDeviceController from './posDevice.controller.js';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { PaymentValidation } from '../../../validation/index.js';
import { PERMISSIONS } from '../../../constants/permissions.js';

const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

router.post(
    '/',
    validate(PaymentValidation.posDeviceSchema),
    UserAuth.requirePermission(PERMISSIONS.POSDEVICE.CREATE),
    posDeviceController.createPOSDeviceController
);

router.get(
    '/',
    UserAuth.requirePermission(PERMISSIONS.POSDEVICE.VIEW),
    posDeviceController.listPOSDevicesController
);

router.patch(
    '/',
    validate(PaymentValidation.posDeviceUpdateSchema),
    UserAuth.requirePermission(PERMISSIONS.POSDEVICE.UPDATE),
    posDeviceController.updatePOSDeviceController
);

router.patch(
    '/restore',
    validate(PaymentValidation.posDeviceUpdateSchema),
    UserAuth.requirePermission(PERMISSIONS.POSDEVICE.UPDATE),
    posDeviceController.restorePOSDeviceController
);

router.get(
    '/:posDeviceId',
    UserAuth.requirePermission(PERMISSIONS.POSDEVICE.VIEW),
    posDeviceController.getPOSDeviceController
);

router.patch(
    '/:posDeviceId',
    UserAuth.requirePermission(PERMISSIONS.POSDEVICE.DELETE),
    posDeviceController.softDeletePosDeviceController
);

export default router;