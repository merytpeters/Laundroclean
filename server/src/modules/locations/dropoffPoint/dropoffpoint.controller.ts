import asyncHandler from '../../../utils/asyncHandler.js';
import DropOffPointService from './dropoffpoint.service.js';
import type { DropOffPointSchema, UpdateDropoffPointSchema } from '../../../validation/location/location.validation.js';

const createDropoffPointController = asyncHandler(async (req, res) => {
	const input: DropOffPointSchema = req.body;

	const created = await DropOffPointService.createDropoffPoint(input);

	return res.status(201).json({
		success: true,
		data: created,
		message: `${created.name} dropoff point created successfully`
	});
});

const updateDropoffPointController = asyncHandler(async (req, res) => {
	const { dropoffId } = req.params;
	const input: UpdateDropoffPointSchema = req.body;

	const updated = await DropOffPointService.updateDropoffPoint(input as any, { id: dropoffId });

	return res.status(200).json({ success: true, data: updated, message: `${updated.name} dropoff point updated successfully` });
});

const getDropoffPointController = asyncHandler(async (req, res) => {
	const { dropoffId } = req.params;
	const q = (req.query ?? {}) as any;
	const params: { isActive?: boolean; search?: string } = {};

	if (q.isActive !== undefined) {
        const isActive =
            q.isActive === 'false' ? false : q.isActive === 'true' ? true : undefined;
        if (isActive !== undefined) params.isActive = isActive;
    }

    if (q.search !== undefined) params.search = String(q.search);

    const isAdmin = req.user?.role?.title === 'ADMIN';

    const drop = await DropOffPointService.getDropoffPoint(
        dropoffId,
        params,
        Boolean(isAdmin)
    );

    return res.status(200).json({
        success: true,
        data: drop,
        message: `${drop.name} dropoff point retrieved successfully`,
    });
});

const listDropoffPointsController = asyncHandler(async (req, res) => {
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

	const result = await DropOffPointService.listDropoffPoints({}, params, Boolean(isAdmin));

	return res.status(200).json({ success: true, ...result, message: 'Dropoff points retrieved successfully' });
});

const makeInactiveController = asyncHandler(async (req, res) => {
	const { dropoffId } = req.params;

	const updated = await DropOffPointService.makeInactive({ id: dropoffId });

	return res.status(200).json({ success: true, data: updated, message: `${updated.name} dropoff point made inactive` });
});

const makeActiveController = asyncHandler(async (req, res) => {
	const { dropoffId } = req.params;

	const updated = await DropOffPointService.makeActive({ id: dropoffId });

	return res.status(200).json({ success: true, data: updated, message: `${updated.name} dropoff point made active` });
});

export default {
	createDropoffPointController,
	updateDropoffPointController,
	getDropoffPointController,
	listDropoffPointsController,
	makeInactiveController,
	makeActiveController
};