import prisma from '../../../config/prisma.js';
import type { Prisma, ServiceArea } from '@prisma/client';
import type { ServiceAreaSchema } from '../../../validation/location/location.validation.js';
import { ProcessingError, ValidationError, ConflictError, NotFoundError } from '../../../middlewares/errorHandler.js';
import { getPagination } from '../../common/pagination/paginate.js';
import DropOffPointUtils from '../dropoffPoint/dropoffpoint.utils.js';
import z from 'zod';

type ServiceAreaInput = ServiceAreaSchema;
type ServiceAreaWhereUniqueInput = Prisma.ServiceAreaWhereUniqueInput;
type ServiceAreaUpdateInput = Prisma.ServiceAreaUpdateInput;
type ServiceAreaOrderByWithAggregationInput = Prisma.ServiceAreaOrderByWithAggregationInput;

const createServiceArea = async (input: ServiceAreaInput): Promise<ServiceArea> => {
    try{
        if (!input) {
            throw new ValidationError('A general name is required for the service area');
        }
        const existingServiceArea = await prisma.serviceArea.findUnique({
            where: { name: input.name }
        });
        if (existingServiceArea) {
            throw new ConflictError(`${input.name} already exists as a service area`);
        }

        if (
            input.latMax !== undefined &&
            input.latMin !== undefined &&
            input.lngMax !== undefined &&
            input.lngMin !== undefined
        ) {
            const servicearea = await prisma.serviceArea.create({
                data: {
                    name: input.name,
                    latMin: input.latMin ,
                    latMax: input.latMax,
                    lngMin: input.lngMin,
                    lngMax: input.lngMax,
                }
           });
           return servicearea;
        }else {
            const result = await DropOffPointUtils.getAreaBound(input.name);
            const servicearea = await prisma.serviceArea.create({
                data: {
                    name: input.name,
                    latMin: result?.minLat ?? null,
                    latMax: result?.maxLat ?? null,
                    lngMin: result?.minLon ?? null,
                    lngMax: result?.maxLon ?? null,
                }
           });
           return servicearea;
        }
    } catch (error) {
        if (error instanceof ConflictError || error instanceof ValidationError) {
            throw error;
        }
        throw new ProcessingError('Cannot create service area at this time');
    }
};

const updateServiceArea = async (input: ServiceAreaInput, where: ServiceAreaWhereUniqueInput): Promise<ServiceArea> => {
    try {
        const servicearea = await prisma.serviceArea.findUnique({
            where,
        });

        if (!servicearea) {
            throw new NotFoundError('Service area not found');
        }

        if (!input) {
            throw new ValidationError('Service area name is required');
        }
        const updateData: ServiceAreaUpdateInput = {};
        if (input.name !== undefined) { 
            updateData.name = input.name;

            if (
                input.latMax !== undefined &&
                input.latMin !== undefined &&
                input.lngMax !== undefined &&
                input.lngMin !== undefined
            ) {
                updateData.latMin = input.latMin;
                updateData.latMax = input.latMax;
                updateData.lngMax = input.lngMax;
                updateData.lngMin = input.lngMin;
            } else {
                const result = await DropOffPointUtils.getAreaBound(input.name);
                if (result) {
                    updateData.latMin = result?.minLat;
                    updateData.latMax = result?.maxLat;
                    updateData.lngMax = result?.maxLon;
                    updateData.lngMin = result?.minLon;
                }
            }
        }

        const updatedservicearea = await prisma.serviceArea.update({
            where,
            data: updateData
        });
        return updatedservicearea;
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ValidationError) {
            throw error;
        }
        throw new ProcessingError('Cannot update service area at this time');
    }
};

const getServiceArea = async (
    where: ServiceAreaWhereUniqueInput | string,
    params: { search?: string; isActive?: boolean } = {},
    isAdmin: boolean = false
): Promise<ServiceArea> => {
    const isActiveFilter = isAdmin ? params.isActive : true;

    const findWhereInput: any = typeof where === 'string' ? { id: where } : { ...where };
    if (typeof isActiveFilter === 'boolean') findWhereInput.isActive = isActiveFilter;

    const servicearea = await prisma.serviceArea.findFirst({ where: findWhereInput });

    if (!servicearea) throw new NotFoundError('Service area not found.');

    return servicearea;
};

const listServiceAreas = async (
    where: ServiceAreaOrderByWithAggregationInput = {},
    params:  { page?: number; limit?: number; isActive?: boolean; search?: string; } = {},
    isAdmin: boolean = false,
) => {
    const paginationInput: Record<string, any> = {};
    if (params.page !== undefined) paginationInput.page = params.page;
    if (params.limit !== undefined) paginationInput.limit = params.limit;
    if (params.search !== undefined) paginationInput.search = params.search;
    
    const { page, limit, skip } = getPagination(paginationInput);

    if (!isAdmin) {
        params.isActive = true;
    }

    const whereInput: any = {};
    if (params.isActive !== undefined) whereInput.isActive = params.isActive;

    if (params.search) {
        whereInput.OR = [
            { id: { contains: params.search } },
        ];
    }

    const [total, serviceAreas] = await Promise.all([
        prisma.serviceArea.count({ where: whereInput }),
        prisma.serviceArea.findMany({
            where: whereInput,
            skip,
            take: limit,
            orderBy: where
        })
    ]);

    return { data: serviceAreas, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const makeServiceAreaInactive = async (where: ServiceAreaWhereUniqueInput): Promise<ServiceArea> => {
    try {
        const servicearea = await prisma.serviceArea.findUnique({ where });
        
        if (!servicearea) {
            throw new NotFoundError('Service area not found');
        }
        
        const updated = await prisma.serviceArea.update({
            where,
            data: { isActive: false }
        });
        
        return updated;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new ProcessingError('Cannot make service area inactive at this time');
    }
};

const makeServiceAreaActive = async (where: ServiceAreaWhereUniqueInput): Promise<ServiceArea> => {
    try {
        const servicearea = await prisma.serviceArea.findUnique({ where });
        
        if (!servicearea) {
            throw new NotFoundError('Service area not found');
        }
        
        const updated = await prisma.serviceArea.update({
            where,
            data: { isActive: true }
        });
        
        return updated;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new ProcessingError('Cannot make service area active at this time');
    }
};

export default {
    createServiceArea,
    updateServiceArea,
    getServiceArea,
    listServiceAreas,
    makeServiceAreaInactive,
    makeServiceAreaActive,
};