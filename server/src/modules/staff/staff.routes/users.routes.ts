import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import { AdminUsersController } from '../../admin/index.js';
import { PERMISSIONS } from '../../../constants/permissions.js';

const router = Router();

router.use(UserAuth.requireCompanyUser());

// will be used for searching up users
router.get(
    '/client-users',
    UserAuth.requirePermission(PERMISSIONS.USER.VIEW),
    AdminUsersController.getUsersController
);

export default router;