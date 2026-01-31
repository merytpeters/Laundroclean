import express from 'express';
import AuthValidation from '../../validation/auth/auth.validation.js';
import validate from '../../middlewares/validate.js';
import AdminController from './admin.controller.js';
import UserAuth from '../../middlewares/auth.js';

const router = express.Router();
router.use(UserAuth.requireCompanyAdmin());

router.post(
    '/company-user/register',
    validate(AuthValidation.signupSchema),
    AdminController.companyRegister
);

export default router;