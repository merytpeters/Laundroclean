import express from 'express';
import UserAuth from '../../../middlewares/auth.js';
import { ProfileController } from '../index.js';
import validate from '../../../middlewares/validate.js';
import profileValidation from '../../../validation/profile/profile.validation.js';

const router = express.Router();

router.use(UserAuth.authenticate());

router.get(
    '/profile',
    ProfileController.getUser
);


router.patch(
    '/profile',
    validate(profileValidation.profileSchema),
    ProfileController.updateProfile
);

router.patch(
    '/profile/change-password',
    validate(profileValidation.changePasswordSchema),
    ProfileController.changePassword
);

router.patch(
    '/soft-delete',
    ProfileController.softDeleteAccount
);

export default router;