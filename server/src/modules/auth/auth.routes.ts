import express from 'express';
import AuthValidation from '../../validation/auth/auth.validation.js';
import validate from '../../middlewares/validate.js';
import authController from './auth.controller.js';


const router = express.Router();

router.post(
    '/register',
    validate(AuthValidation.signupSchema),
    authController.register
);


export default router;