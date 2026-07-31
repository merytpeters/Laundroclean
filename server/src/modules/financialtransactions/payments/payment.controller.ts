import { ForbiddenError } from '../../../middlewares/errorHandler.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import type { BasePaymentProofSchema, InitiatePaymentSchema, UpdatePaymentProofSchema, UpdatePaymentSchema } from '../../../validation/financialtransactions/payment.validation.js';
import { paymentService } from './payments.service.js';
import { PaymentProofService } from './paymentproof.service.js';
import { MediaService } from '../../common/index.js';
import { PaymentUtils } from '../index.js';


const initiatePaymentController = asyncHandler(async (req, res) => {
    let payment: InitiatePaymentSchema = req.body;
    const canInitiate =
        req.user?.type === 'COMPANYUSER' ||
        payment.userId === req.user?.id;

    if (!canInitiate) {
        throw new ForbiddenError(
            'You are not authorized to initiated payment for this user.'
        );
    }

    const newPayment = paymentService.initiatePayment(payment);

    res.status(201).json({
        success: true,
        data: newPayment,
        message: 'Payment initiated successfully.',
    });
});


const uploadPaymentProofForOtherBankTransferController = asyncHandler(async (req, res) => {
    let paymentProofData: BasePaymentProofSchema = req.body;
    const { paymentId } = paymentProofData;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }

    const payment = await paymentService.getPaymentById(paymentId);
    const paymentUserId = payment.transaction.userId;

    const canUpload =
        req.user?.type === 'COMPANYUSER' ||
        paymentUserId === req.user?.id;

    if (!canUpload) {
        throw new ForbiddenError(
            'You are not authorized to upload proof for this payment.'
        );
    }

    const { secure_url, public_id } = await MediaService.uploadImage(
        req.file.buffer,
        `payment/${paymentId}/${paymentUserId}`,
        'proof',
    );

    const paymentProof = await PaymentProofService.createPaymentProof({
        paymentId,
        fileUrl: secure_url,
        publicId: public_id,
        fileName: paymentProofData.fileName,
        mimeType: paymentProofData.mimeType,
        uploadedBy: paymentProofData.uploadedBy,
    });

    res.status(201).json({
        success: true,
        data: paymentProof,
        message: 'Payment proof uploaded successfully.'
    });
});

const updatePaymentProofController = asyncHandler(async (req, res) => {
    const { proofId } = req.params;
    let paymentProofData: UpdatePaymentProofSchema = req.body;

    const paymentProof = await PaymentProofService.getPaymentProofById(proofId);
    const paymentUserId = paymentProof.payment.transaction.userId;
    const paymentId = paymentProof.paymentId;

    const canUpdate =
        req.user?.type === 'COMPANYUSER' ||
        paymentUserId === req.user?.id;

    if (!canUpdate) {
        throw new ForbiddenError(
            'You are not authorized to update this payment proof.'
        );
    }

    let updatedPaymentProof;

    if (!req.file) {
        updatedPaymentProof = await PaymentProofService.updatePaymentProof(proofId, {
            fileName: paymentProofData.fileName,
        });
    } else {
        // delete the public id so a new 
        if (!paymentProofData.publicId) {
            throw new Error('public id is required to update this payment proof');
        } else {
            await MediaService.deleteImage(paymentProofData.publicId);
        }

        const { secure_url, public_id } = await MediaService.uploadImage(
            req.file.buffer,
            `payment/${paymentId}/${paymentUserId}`,
            'proof',
        );

        updatedPaymentProof = await PaymentProofService.updatePaymentProof(proofId, {
            fileUrl: secure_url,
            publicId: public_id,
            fileName: paymentProofData.fileName,
            mimeType: paymentProofData.mimeType,
        });

        res.status(200).json({
            success: true,
            data: updatedPaymentProof,
            message: 'Payment proof updated successfully.'
        });
    }
});

const updatePaymentManuallyController = asyncHandler(async (req, res) => {
    let { paymentId } = req.params;
    let updatePaymentData: UpdatePaymentSchema = req.body;

    const canUpdate =
        req.user?.type === 'COMPANYUSER';

    if (!canUpdate) {
        throw new ForbiddenError(
            'You are not authorized to update this payment.'
        );
    }

    const payment = await paymentService.getPaymentById(paymentId);

    if (payment.channel !== null) {
        const generatedProvRef = PaymentUtils.generateInternalProviderRef(payment.channel);
        updatePaymentData.providerRef = generatedProvRef;
    }

    const updatedPayment = await paymentService.updatePaymentManually(paymentId, {
        status: updatePaymentData.status,
        providerRef: updatePaymentData.providerRef,
    });

    res.status(200).json({
        success: true,
        data: updatedPayment,
        message: 'Payment verification update successful.'
    });
});

const getPaymentByIdController = asyncHandler(async (req, res) => {
    let { paymentId } = req.params;

    const payment = await paymentService.getPaymentById(paymentId);

    const canGetPayment =
        req.user?.type === 'COMPANYUSER' ||
        payment.transaction.userId === req.user?.id;

    if (!canGetPayment) {
        throw new ForbiddenError(
            'You are not authorized to see this payment.'
        );
    }

    res.status(200).json({
        success: true,
        data: payment,
        message: 'Payment retrieved successfully.'
    });

});

export default {
    initiatePaymentController,
    uploadPaymentProofForOtherBankTransferController,
    updatePaymentProofController,
    updatePaymentManuallyController,
    getPaymentByIdController,
};