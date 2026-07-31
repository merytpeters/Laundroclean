import express from 'express';
import PaymentValidation from '../../../validation/financialtransactions/payment.validation.js';
import validate from '../../../middlewares/validate.js';
import paymentController from './payment.controller.js';
import UserAuth from '../../../middlewares/auth.js';
import upload from '../../../middlewares/media.upload.js';
import { PERMISSIONS } from '../../../constants/permissions.js';

const router = express.Router();
router.use(UserAuth.authenticate());

router.post(
    '/initiate',
    validate(PaymentValidation.initiatePaymentSchema),
    paymentController.initiatePaymentController
);


router.post(
    '/proof',
    validate(PaymentValidation.basePaymentProofSchema),
    upload.single('proof'),
    paymentController.uploadPaymentProofForOtherBankTransferController
);

router.patch(
    '/proof/:proofId',
    validate(PaymentValidation.updatePaymentProofSchema),
    upload.single('proof'),
    paymentController.updatePaymentProofController
);

router.patch(
    '/companyuser/proof/:proofId',
    UserAuth.requirePermission(PERMISSIONS.PAYMENT.UPDATE),
    validate(PaymentValidation.updatePaymentProofSchema),
    upload.single('proof'),
    paymentController.updatePaymentProofController
);

router.get(
    '/:paymentId',
    paymentController.getPaymentByIdController
);

router.get(
    '/companyuser/:paymentId',
    UserAuth.requirePermission(PERMISSIONS.PAYMENT.VIEW),
    paymentController.getPaymentByIdController
);

router.patch(
    '/:paymentId',
    UserAuth.requireCompanyUser(),
    UserAuth.requirePermission(PERMISSIONS.PAYMENT.UPDATE),
    validate(PaymentValidation.updatePaymentSchema),
    paymentController.updatePaymentManuallyController
);
export default router;