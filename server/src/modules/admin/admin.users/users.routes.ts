import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import { AdminUsersController } from '../index.js';


const router = Router();

router.use(UserAuth.requireCompanyAdmin());

router.get(
    '/users/:userId',
    AdminUsersController.getProfile
);

router.get('/users', AdminUsersController.getUsersController);

router.patch('/users/:userId/status', AdminUsersController.setUserActiveStatusController);
 
router.patch('/users/:userId/restore', AdminUsersController.restoreUserController);


export default router;
