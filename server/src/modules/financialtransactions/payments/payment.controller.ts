import asyncHandler from '../../../utils/asyncHandler.js';
import type { InitiatePaymentSchema } from '../../../validation/financialtransactions/payment.validation.js';
import { paymentService } from './payments.service.js';


const initiatePaymentController = asyncHandler(async (req, res) => {
    let payment: InitiatePaymentSchema = req.body;

    const newPayment = paymentService.initiatePayment(payment);

    res.status(201).json({
        success: true,
        data: newPayment,
        message: 'Payment initiated successfully.',
    });
});

export default {
    initiatePaymentController,
};