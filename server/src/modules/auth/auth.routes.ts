import express from 'express';
import AuthValidation from '../../validation/auth/auth.validation.js';
import validate from '../../middlewares/validate.js';
import authController from './auth.controller.js';
import { EmailController } from '../emailService/index.js';


const router = express.Router();
const emailController = new EmailController();

router.post(
    '/client/register',
    validate(AuthValidation.signupSchema),
    authController.clientRegister
);


router.post(
    '/login',
    validate(AuthValidation.loginSchema),
    authController.login
);

router.post(
  '/forgot-password',
  emailController.requestPasswordReset
);


export default router;