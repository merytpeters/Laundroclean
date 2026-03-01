import express from 'express';
import UserAuth from '../../../middlewares/auth.js';
import { ProfileController } from '../index.js';
import validate from '../../../middlewares/validate.js';
import upload from '../../../middlewares/media.upload.js';
import profileValidation from '../../../validation/profile/profile.validation.js';

const router = express.Router();

router.use(UserAuth.authenticate());

router.get(
    '/',
    ProfileController.getUser
);

router.patch(
    '/',
    validate(profileValidation.profileSchema),
    ProfileController.updateProfile
);

router.patch(
    '/change-password',
    validate(profileValidation.changePasswordSchema),
    ProfileController.changePassword
);

router.patch(
    '/soft-delete',
    ProfileController.softDeleteAccount
);

router.patch(
    '/pic',
    upload.single('avatar'),
    ProfileController.uploadProfilePic
);

router.delete(
  '/pic',
  ProfileController.deleteProfilePic
);

export default router;