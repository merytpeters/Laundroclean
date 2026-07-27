import express from 'express';
import PaymentValidation from '../../../validation/financialtransactions/payment.validation.js';
import validate from '../../../middlewares/validate.js';
import paymentController from './payment.controller.js';
import UserAuth from '../../../middlewares/auth.js';

const router = express.Router();
router.use(UserAuth.authenticate());

router.post(
    '/initiate',
    validate(PaymentValidation.initiatePaymentSchema),
    paymentController.initiatePaymentController
);

export default router;