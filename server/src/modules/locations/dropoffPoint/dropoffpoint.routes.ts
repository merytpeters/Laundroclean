import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { LocationValidation } from '../../../validation/index.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import DropOffPointController from '../dropoffPoint/dropoffpoint.controller.js';

const router = Router();

router.use(UserAuth.authenticate());

router.post(
	'/',
    validate(LocationValidation.dropOffPointSchema),
    UserAuth.requireCompanyUser(),
	UserAuth.requirePermission(PERMISSIONS.DROPOFF.CREATE),
	DropOffPointController.createDropoffPointController
);

router.get(
	'/',
	DropOffPointController.listDropoffPointsController
);

router.patch(
	'/:dropoffId',
    validate(LocationValidation.updateDropoffPointSchema),
    UserAuth.requireCompanyUser(),
	UserAuth.requirePermission(PERMISSIONS.DROPOFF.UPDATE),
	DropOffPointController.updateDropoffPointController
);

router.get(
	'/:dropoffId',
	DropOffPointController.getDropoffPointController
);

router.patch(
	'/:dropoffId/inactive',
    UserAuth.requireCompanyUser(),
	UserAuth.requirePermission(PERMISSIONS.DROPOFF.DELETE),
	DropOffPointController.makeInactiveController
);

router.patch(
	'/:dropoffId/active',
    UserAuth.requireCompanyUser(),
	UserAuth.requirePermission(PERMISSIONS.DROPOFF.ACTIVATE),
	DropOffPointController.makeActiveController
);

export default router;