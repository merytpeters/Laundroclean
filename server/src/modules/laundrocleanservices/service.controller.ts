import LaundrocleanservicesService from './service.service.js';
import type { ServiceSchema, UpdateServiceSchema } from '../../validation/laundrocleanservices/services.validation.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ValidationError } from '../../middlewares/errorHandler.js';

const companyCreateServiceController = asyncHandler(async (req, res) => {
    const newServiceData: ServiceSchema = req.body;

    const newService = await LaundrocleanservicesService.createService(newServiceData);

    return res.status(201).json({
        success: true,
        message: `${newService.name} service successfully created`,
        data: newService
    });
});

const companyUpdateServiceController = asyncHandler(async (req, res) => {
    const serviceId = (req.params as any).serviceId ?? req.params.id;
    const serviceData: UpdateServiceSchema = req.body;

    const updatedService = await LaundrocleanservicesService.updateService({id: serviceId}, serviceData);

    return res.status(200).json({
        success: true,
        message: `${updatedService.name} service updated successfully`,
        data: updatedService
    });
});

// get active service for both company user and client
const getActiveServiceById = asyncHandler(async (req, res) => {
    const serviceId = (req.params as any).serviceId ?? req.params.id;

    const service = await LaundrocleanservicesService.getActiveServiceById({id: serviceId});

    return res.status(200).json({
        success: true,
        message: `${service.name} service retrieved successfully`,
        data: service
    });
});

// get active and inactive service for admin only
const companyGetServiceById = asyncHandler(async (req, res) => {
    const serviceId = (req.params as any).serviceId ?? req.params.id;

    const service = await LaundrocleanservicesService.getServiceById({id: serviceId});

    return res.status(200).json({
        success: true,
        message: `${service.name} service retrieved successfully`,
        data: service
    });
});

// for both company user and client
const searchActiveServices = asyncHandler(async (req, res) => {
    const searchQuery = req?.query;

    const active_services = await LaundrocleanservicesService.searchActiveServices(searchQuery);

    return res.status(200).json({
        success: true,
        message: 'Active services fetched successfully',
        data: active_services.data,
        meta: active_services.meta
    });
});

// admin only
const companySoftDeleteServices = asyncHandler(async (req, res) => {
    const { ids } = req.body || {};
    const serviceId = (req.params as any)?.serviceId;


    if (serviceId) {
        // Soft delete single by id
        try {
            const result = await LaundrocleanservicesService.softDeleteServices({
                id: serviceId,
                isActive: true
            });

            return res.status(200).json({
                success: true,
                message: 'Service soft deleted successfully',
                data: result
            });
        } catch (err: any) {
            throw err;
        }
    }

    // Soft delete multiple
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ValidationError('Please provide services to delete');
    }

    try {
        const result = await LaundrocleanservicesService.softDeleteServices({
            id: { in: ids },
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: 'Services soft deleted successfully',
            data: {
                deletedCount: result.count
            }
        });
    } catch (err: any) {
         
        console.error('Error soft-deleting multiple services:', err?.message || err);
        throw err;
    }
});

// for admin only
const companySearchAllServices = asyncHandler(async (req, res) => {
    const searchQuery = req?.query;

    const all_services = await LaundrocleanservicesService.searchAllServices(searchQuery);

    return res.status(200).json({
        success: true,
        message: 'Active services fetched successfully',
        data: all_services.data,
        meta: all_services.meta
    });
});

const companyRestoreService = asyncHandler(async (req, res) => {
    const serviceId = (req.params as any).serviceId ?? req.params.id;

    const service_restored = await LaundrocleanservicesService.restoreService({id: serviceId});

    return res.status(200).json({
        success: true,
        message: `${service_restored.name} service restored`,
        data: service_restored
    });
});


const companyRestoreManyServices  = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ValidationError('Please provide services to restore');
    }

    const restored_services = await LaundrocleanservicesService.restoreManyServices({
        id: { in: ids },
        isActive: false 
    });

    return res.status(200).json({
        success: true,
        message: `${restored_services.count} services restored`,
        data: restored_services
    });
});

export default {
    companyCreateServiceController,
    companyUpdateServiceController,
    getActiveServiceById,
    companyGetServiceById,
    searchActiveServices,
    companySoftDeleteServices,
    companySearchAllServices,
    companyRestoreService,
    companyRestoreManyServices,
};