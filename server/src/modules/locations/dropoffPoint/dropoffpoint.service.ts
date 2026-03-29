import prisma from '../../../config/prisma.js';
import type { Prisma, DropOffPoint } from '@prisma/client';
import type { DropOffPointSchema, UpdateDropoffPointSchema } from '../../../validation/location/location.validation.js';
import { DropOffPointUtils } from '../index.js';
import { NotFoundError, ProcessingError, ValidationError, ConflictError, UnauthorizedError } from '../../../middlewares/errorHandler.js';
import { getPagination } from '../../common/pagination/paginate.js';

type DropOffPointInput = DropOffPointSchema;
type UpdateDropoffPointInput = UpdateDropoffPointSchema;
type DropOffPointWhereUniqueInput = Prisma.DropOffPointWhereUniqueInput
type DropOffPointUpdateInput = Prisma.DropOffPointUpdateInput;
type DropOffPointOrderByWithAggregationInput = Prisma.DropOffPointOrderByWithAggregationInput


const createDropoffPoint = async (input: DropOffPointInput ): Promise<DropOffPoint> => {
    try {
        if (!input) {
            throw new ValidationError('A general name and specific address is required');
        }
        const existingDropoffPoint = await prisma.dropOffPoint.findUnique({
            where: { name: input.name }
        });
        if (existingDropoffPoint) {
            throw new ConflictError(`${input.name} already exist as a drop off point`);
        }
        const result = await DropOffPointUtils.getLatLonFromAddress(input.address);
        const dropoffPoint = await prisma.dropOffPoint.create({
            data: {
                name: input.name,
                address: input.address,
                lat: result?.lat ?? null,
                lng: result?.lon ?? null,
            }
        });
        return dropoffPoint;
    } catch (error) {
        if (error instanceof ConflictError || error instanceof ValidationError) {
            throw error;
        }
        throw new ProcessingError('Cannot create dropoff point at this time');
    }
};

const updateDropoffPoint = async (input:  UpdateDropoffPointInput, where: DropOffPointWhereUniqueInput): Promise<DropOffPoint> => {
    try {
        const dropoffPoint = await prisma.dropOffPoint.findUnique({
            where,
        });

        if (!dropoffPoint) {
            throw new NotFoundError('Dropoff point not found');
        }
        if (!input) {
            throw new ValidationError('At least one field should be filled');
        }
        const updateData: DropOffPointUpdateInput = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.address !== undefined) {
            updateData.address = input.address;

            const result = await DropOffPointUtils.getLatLonFromAddress(input.address);
            if (result) {
                updateData.lat = result?.lat;
                updateData.lng = result.lon;
            }
        }

        const updateddropoffpoint = await prisma.dropOffPoint.update({
            where,
            data: updateData
        });
        return updateddropoffpoint;
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ValidationError) {
            throw error;
        }
        throw new ProcessingError('Cannot update dropoff point at this time');
    }
};

const getDropoffPoint = async (
    where: DropOffPointWhereUniqueInput | string,
    params: { search?: string; isActive?: boolean } = {},
    isAdmin: boolean = false
): Promise<DropOffPoint> => {

    if (params.isActive === false && !isAdmin) {
        throw new UnauthorizedError('Only admins can view inactive dropoff points');
    }

    const findWhereInput: any = typeof where === 'string' ? { id: where } : where;
    if (params.isActive !== undefined) findWhereInput.isActive = params.isActive;

    const dropoffpoint = await prisma.dropOffPoint.findUnique({
        where: findWhereInput
    });

    if (!dropoffpoint) throw new NotFoundError('Dropoff point not found.');

    return dropoffpoint;
};

// list by isActive, search, 
const listDropoffPoints = async (
    where: DropOffPointOrderByWithAggregationInput = {},
    params: { page?: number; limit?: number; isActive?: boolean; search?: string; } = {},
    isAdmin: boolean = false,
) => {

    const paginationInput: Record<string, any> = {};
    if (params.page !== undefined) paginationInput.page = params.page;
    if (params.limit !== undefined) paginationInput.limit = params.limit;
    if (params.search !== undefined) paginationInput.search = params.search;
    
    const { page, limit, skip } = getPagination(paginationInput);

    if (params.isActive === false && !isAdmin) {
        throw new UnauthorizedError('Only admins can view inactive dropoff points');
    }

    const whereInput: any = {};
    if (params.isActive !== undefined) whereInput.isActive = params.isActive;

    if (params.search) {
        whereInput.OR = [
            { id: { contains: params.search } },
        ];
    }

    const [total, dropoffPoints] = await Promise.all([
        prisma.dropOffPoint.count({ where: whereInput }),
        prisma.dropOffPoint.findMany({
            where: whereInput,
            skip,
            take: limit,
            orderBy: where
        })
    ]);

    return { data: dropoffPoints, pagination: { page, limit, total } };
};

const makeInactive = async (where: DropOffPointWhereUniqueInput): Promise<DropOffPoint> => {
    try {
        const dropoffPoint = await prisma.dropOffPoint.findUnique({ where });
        
        if (!dropoffPoint) {
            throw new NotFoundError('Dropoff point not found');
        }
        
        const updated = await prisma.dropOffPoint.update({
            where,
            data: { isActive: false }
        });
        
        return updated;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new ProcessingError('Cannot make dropoff point inactive at this time');
    }
};

const makeActive = async (where: DropOffPointWhereUniqueInput): Promise<DropOffPoint> => {
    try {
        const dropoffPoint = await prisma.dropOffPoint.findUnique({ where });
        
        if (!dropoffPoint) {
            throw new NotFoundError('Dropoff point not found');
        }
        
        const updated = await prisma.dropOffPoint.update({
            where,
            data: { isActive: true }
        });
        
        return updated;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new ProcessingError('Cannot make dropoff point active at this time');
    }
};


export default {
    createDropoffPoint,
    updateDropoffPoint,
    getDropoffPoint,
    listDropoffPoints,
    makeActive,
    makeInactive
};