import asyncHandler from '../../../utils/asyncHandler.js';
import ServiceareaService from '../serviceArea/servicearea.service.js';
import type { ServiceAreaSchema } from '../../../validation/location/location.validation.js';

const createServiceAreaController = asyncHandler(async (req, res) => {
    const input: ServiceAreaSchema = req.body;

    const created = await ServiceareaService.createServiceArea(input);

    return res.status(201).json({
        success: true,
        data: created,
        message: `${created.name} service area created successfully`
    });
});

const updateServiceAreaController = asyncHandler(async (req, res) => {
    const { serviceareaId } = req.params;
    const input: ServiceAreaSchema = req.body;

    const updated = await ServiceareaService.updateServiceArea(input, { id: serviceareaId });

    return res.status(200).json({
        success: true,
        data: updated,
        message: `${updated.name} service area created successfully`
    });
});

const getServiceAreaController = asyncHandler(async (req, res) => {
    const { serviceareaId } = req.params;
    const q = (req.query ?? {}) as any;
    const params: { isActive?: boolean; search?: string } = {};
    
    if (q.isActive !== undefined) {
        const isActive =
            q.isActive === 'false' ? false : q.isActive === 'true' ? true : undefined;
        if (isActive !== undefined) params.isActive = isActive;
    }
    
    if (q.search !== undefined) params.search = String(q.search);
    
    const isAdmin = req.user?.role?.title === 'ADMIN';
    
    const servicearea = await ServiceareaService.getServiceArea(
        serviceareaId,
        params,
        Boolean(isAdmin)
    );
    
    return res.status(200).json({
        success: true,
        data: servicearea,
        message: `${servicearea.name} service area retrieved successfully`,
    });
});

const listServiceAreas = asyncHandler(async (req, res) => {
	const q = req.query as any;
	const page = q.page ? Number(q.page) : undefined;
	const limit = q.limit ? Number(q.limit) : undefined;
	const isActive = q.isActive !== undefined ? (q.isActive === 'false' ? false : q.isActive === 'true' ? true : undefined) : undefined;
	const search = q.search as string | undefined;

	const params: { page?: number; limit?: number; isActive?: boolean; search?: string } = {};
	if (page !== undefined) params.page = page;
	if (limit !== undefined) params.limit = limit;
	if (isActive !== undefined) params.isActive = isActive;
	if (search !== undefined) params.search = search;

	const isAdmin = req.user?.role?.title === 'ADMIN';

	const result = await ServiceareaService.listServiceAreas({}, params, Boolean(isAdmin));

	return res.status(200).json({ success: true, ...result, message: 'Service areas retrieved successfully' });
});

const makeServiceAreaInactiveController = asyncHandler(async (req, res) => {
	const { serviceareaId } = req.params;

	const updated = await ServiceareaService.makeServiceAreaInactive({ id: serviceareaId });

	return res.status(200).json({ success: true, data: updated, message: `${updated.name} service area made inactive` });
});

const makeServiceAreaActiveController = asyncHandler(async (req, res) => {
	const { serviceareaId } = req.params;

	const updated = await ServiceareaService.makeServiceAreaActive({ id: serviceareaId });

	return res.status(200).json({ success: true, data: updated, message: `${updated.name} service area made active` });
});

export default {
    createServiceAreaController,
    updateServiceAreaController,
    getServiceAreaController,
    listServiceAreas,
    makeServiceAreaInactiveController,
    makeServiceAreaActiveController
};