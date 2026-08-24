import express from 'express';
import AuthValidation from '../../validation/auth/auth.validation.js';
import validate from '../../middlewares/validate.js';
import authController from './auth.controller.js';
import { EmailController } from '../emailService/index.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';
import UserAuth from '../../middlewares/auth.js';

const router = express.Router();
const emailController = new EmailController();

router.post(
    '/client/register',
    authLimiter,
    validate(AuthValidation.signupSchema),
    authController.clientRegister
);


router.post(
    '/login',
    authLimiter,
    validate(AuthValidation.loginSchema),
    authController.login
);

router.post(
    '/forgot-password',
    authLimiter,
    emailController.requestPasswordReset
);

router.post(
    '/reset-password',
    authLimiter,
    authController.resetPassword
);

router.post(
    '/logout',
    authLimiter,
    UserAuth.authenticate(),
    authController.logout
);

router.post(
    '/refresh',
    authLimiter,
    authController.refresh
);


export default router;