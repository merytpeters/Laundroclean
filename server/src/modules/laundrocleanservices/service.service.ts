import prisma from '../../config/prisma.js';
import z from 'zod';
import type { Prisma, Service } from '@prisma/client';
import { ProcessingError, NotFoundError, ValidationError } from '../../middlewares/errorHandler.js';
import type { ServiceSchema, UpdateServiceSchema } from '../../validation/laundrocleanservices/services.validation.js';
import ServiceValidation from '../../validation/laundrocleanservices/services.validation.js';
import type { PaginationQuery } from '../../utils/asyncHandler.js';
import { getPagination } from '../common/pagination/paginate.js';

type ServiceCreateInput = Prisma.ServiceCreateInput
type ServiceWhereUniqueInput = Prisma.ServiceWhereUniqueInput
type ServiceWhereInput = Prisma.ServiceWhereInput
type ServiceUpdateInput = Prisma.ServiceUpdateInput
type BatchPayload = Prisma.BatchPayload


const createService = async(payload: ServiceSchema): Promise<Service> => {
    try {
        const validatedData = ServiceValidation.serviceSchema.parse(payload);

        const data: ServiceCreateInput = {
            name: validatedData.name,
            description: validatedData.description,
        };
        const service = await prisma.service.create({ data });
        return service;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(
                `Validation failed: ${error.issues.map(e => e.message).join(', ')}`
            );
        }
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to create service');
    }
};

const updateService = async(where: ServiceWhereUniqueInput, payload: UpdateServiceSchema): Promise<Service> => {
    const now = new Date();
    try {
        const service = await prisma.service.findUnique({ where });
        if (!service) throw new NotFoundError('Service not found');

        const data: ServiceUpdateInput = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined)
        );
        if (data.isActive === false) {
            data.deletedAt = now;
        }
        const updatedService = await prisma.service.update({
            where,
            data
        });
        return updatedService;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(`Validation failed: ${error.issues.map(e => e.message).join(', ')}`);
        }
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to update service');
    }
};

const getActiveServiceById = async(
    where: ServiceWhereUniqueInput
): Promise<Service & { prices: { id: string; amount: string; currency: string; pricingType: string; isActive: boolean }[] }> => {
    try {
        const whereClause = Object.fromEntries(
            Object.entries(where).filter(([, value]) => value !== undefined)
        ) as ServiceWhereUniqueInput;
        const service = await prisma.service.findFirst({
            where: {
                ...whereClause,
                isActive: true
            } as ServiceWhereInput,
            include: {
                prices: { where: { isActive: true } }
            }
        });

        if (!service) throw new NotFoundError('Service not found');

        return {
            ...service,
            prices: service.prices.map(price => ({
                id: price.id,
                amount: price.amount.toString(),
                currency: price.currency.toString(),
                pricingType: price.pricingType.toString(),
                isActive: price.isActive
            }))
        };
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to fetch service');
    }
};


const getServiceById = async(
    where: ServiceWhereUniqueInput
): Promise<Service & { prices: { id: string; amount: string; currency: string; pricingType: string; isActive: boolean }[] }> => {
    try {
        const service = await prisma.service.findUnique({
            where,
            include: {
                prices: {
                    where: { isActive: true } 
                }
            }
        });
        if (!service) throw new NotFoundError('Service not found');
        return {
            ...service,
            prices: service.prices.map(price => ({
                id: price.id,
                amount: price.amount.toString(),
                currency: price.currency.toString(),
                pricingType: price.pricingType.toString(),
                isActive: price.isActive,
            }))
        };
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to fetch service');
    }
};

// include client user
const searchActiveServices = async(
    query?: PaginationQuery
): Promise<{ data: Service[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    try {
        const { page, limit, skip } = getPagination(query || {});
        const search = query?.search;

        const where: ServiceWhereInput = {
            isActive: true,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const [services, total] = await Promise.all([
            await prisma.service.findMany({
                where,
                skip,
                take: limit,
                include: {
                    prices: {
                        where: { isActive: true }
                    }
                }
            }),
            prisma.service.count({ where })
        ]);

        return {
            data: services,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to fetch active services');
    }
};

const softDeleteServices = async(
    where: ServiceWhereInput
): Promise<BatchPayload> => {
    const now = new Date();
    try {
        const result = await prisma.service.updateMany({
            where,
            data: {
                isActive: false,
                deletedAt: now
            }
        });
        return result;
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to soft delete services');
    }
};


const searchAllServices = async(
    query?: PaginationQuery
):Promise<{ data: Service[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    try {
        const { page, limit, skip } = getPagination(query || {});
        const search = query?.search?.trim();

        const where: ServiceWhereInput = {
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const [services, total] = await Promise.all([
            prisma.service.findMany({
                where,
                skip,
                take: limit,
                include: { prices: true }
            }),
            prisma.service.count({ where })
        ]);

        return {
            data: services,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to search all services');
    }
};

const restoreService = async(
    where: ServiceWhereUniqueInput
): Promise<Service> => {
    try {
        const service = await prisma.service.findUnique({ where });
        if (!service) throw new NotFoundError('Service not found');

        const restored = await prisma.service.update({
            where,
            data: {
                isActive: true,
                deletedAt: null,
            }
        });

        return restored;
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to restore service');
    }
};

const restoreManyServices = async(
    where: ServiceWhereInput
): Promise<BatchPayload> => {
    try {
        const result = await prisma.service.updateMany({
            where,
            data: {
                isActive: true,
                deletedAt: null,
            }
        });

        if (result.count === 0) {
            throw new NotFoundError('No services found to restore');
        }

        return result;
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to restore services');
    }
};

export default {
    createService,
    updateService,
    getServiceById,
    searchActiveServices,
    softDeleteServices,
    searchAllServices,
    restoreService,
    restoreManyServices,
    getActiveServiceById
};
