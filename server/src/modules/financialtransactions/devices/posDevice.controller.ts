import posDeviceService from './posDevice.service.js';
import asyncHandler, { type ByActiveQuery } from '../../../utils/asyncHandler.js';
import { PaymentValidation } from '../../../validation/index.js';


const createPOSDeviceController = asyncHandler(async (req, res) => {
    const newPOSDeviceData = PaymentValidation.posDeviceSchema.parse(req.body);

    const newPOSDevice = await posDeviceService.createPOSDevice(newPOSDeviceData);

    return res.status(201).json({
        success: true,
        message: `${newPOSDevice.name} POS device successfully created`,
        data: newPOSDevice
    });
});


const getPOSDeviceController = asyncHandler(async (req, res) => {
    const posDeviceId = req.params.id ?? req.params.serialNumber;

    const posDevice = await posDeviceService.getPOSDevice(posDeviceId);

    return res.status(200).json({
        success: true,
        message: `${posDevice?.name} POS Device retrieved successfully`,
        data: posDevice
    });
});

const listPOSDevicesController = asyncHandler(async (req, res) => {
    const searchQuery = req?.query as unknown as ByActiveQuery;
    const isAdmin = req.user?.role?.title === 'ADMIN';

    const posDevices = await posDeviceService.listPOSDevices(searchQuery, isAdmin);

    return res.status(200).json({
        success: true,
        message: 'POS Devices fetched successfully',
        data: posDevices.data,
        meta: posDevices.meta
    });
});


// Admin only controllers and routes

const softDeletePosDeviceController = asyncHandler(async (req, res) => {
    const posDeviceId = req.params.id ?? req.params.serialNumber;
    await posDeviceService.softDeletePosDevice(posDeviceId);

    res.status(200).json({
            success: true,
            message: 'POS device soft deleted successfully',
        });
});

const updatePOSDeviceController = asyncHandler(async (req, res) => {
    const posDeviceData = PaymentValidation.posDeviceUpdateSchema.parse(req.body);

    const updatedPosDevice = await posDeviceService.updatePosDevice(posDeviceData);

    return res.status(200).json({
        success: true,
        message: `${updatedPosDevice?.name} POS Device updated successfully`,
        data: updatedPosDevice
    });

});


const restorePOSDeviceController = asyncHandler(async (req, res) => {
    const posDeviceData = PaymentValidation.posDeviceUpdateSchema.parse(req.body);

    const restoredPosDevice = await posDeviceService.updatePosDevice(posDeviceData);

    return res.status(200).json({
        success: true,
        message: `${restoredPosDevice?.name} POS Device retored successfully`,
        data: restoredPosDevice
    });

});

export default {
    createPOSDeviceController,
    getPOSDeviceController,
    listPOSDevicesController,
    softDeletePosDeviceController,
    restorePOSDeviceController,
    updatePOSDeviceController
};