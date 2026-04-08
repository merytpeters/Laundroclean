import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { LocationValidation } from '../../../validation/index.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import ServiceareaController from '../serviceArea/servicearea.controller.js';

const router = Router();

router.use(UserAuth.authenticate());

router.post(
	'/',
    validate(LocationValidation.serviceAreaSchema),
    UserAuth.requireCompanyUser(),
	UserAuth.requirePermission(PERMISSIONS.SERVICEAREA.CREATE),
	ServiceareaController.createServiceAreaController
);

router.get(
    '/',
    ServiceareaController.listServiceAreas
);

router.patch(
    '/:serviceareaId',
    validate(LocationValidation.serviceAreaSchema),
    UserAuth.requireCompanyUser(),
    UserAuth.requirePermission(PERMISSIONS.SERVICEAREA.UPDATE),
    ServiceareaController.updateServiceAreaController
);

router.get(
    '/:serviceareaId',
    ServiceareaController.getServiceAreaController
);

router.patch(
    '/:serviceareaId/inactive',
    UserAuth.requireCompanyUser(),
    UserAuth.requirePermission(PERMISSIONS.SERVICEAREA.DELETE),
    ServiceareaController.makeServiceAreaInactiveController
);

router.patch(
    '/:serviceareaId/active',
    UserAuth.requireCompanyUser(),
    UserAuth.requirePermission(PERMISSIONS.SERVICEAREA.ACTIVATE),
    ServiceareaController.makeServiceAreaActiveController
);

export default router;