import prisma from '../../../config/prisma.js';
import type { Prisma, PosDevice } from '@prisma/client';
import { ConflictError, NotFoundError, ProcessingError } from '../../../middlewares/errorHandler.js';
import type { POSdeviceSchema, POSdeviceUpdateSchema } from '../../../validation/financialtransactions/payment.validation.js';
import type { ByActiveQuery } from '../../../utils/asyncHandler.js';
import { getPagination } from '../../common/pagination/paginate.js';
import { PaymentValidation } from '../../../validation/index.js';


type PosDeviceInput = POSdeviceSchema;
type UpdatePosDeviceInput = POSdeviceUpdateSchema;
type PosDeviceWhereUniqueInput = Prisma.PosDeviceWhereUniqueInput;

const createPOSDevice = async (
    input: PosDeviceInput
): Promise<PosDevice> => {
    try {
        const serialNumber = input.serialNumber;
        const existingPosDevice = await prisma.posDevice.findUnique({ where: { serialNumber } });
        if (existingPosDevice) {
            throw new ConflictError(`Pos device with serial number ${input.serialNumber} already exists`);
        }
        const posDevice = await prisma.posDevice.create({
            data: {
                name: input?.name || null,
                serialNumber: input.serialNumber,
            }
        });
        return posDevice;
    } catch (error: any) {
        if (error.code !== 'P2002') throw error;
        throw new ProcessingError(error?.message || 'Failed to create posDevice');
    }
};


const getPOSDevice = async (
    where: PosDeviceWhereUniqueInput
): Promise<PosDevice> => {
    try {
        const posDevice = await prisma.posDevice.findUnique({
            where
        });
        if (!posDevice) throw new NotFoundError(`POS Device with this serial number ${where.serialNumber} not found`);
        return posDevice;
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to fetch POS Device');
    }
};

const listPOSDevices = async (
    query?: ByActiveQuery,
    isAdmin: boolean = false
): Promise<{ data: PosDevice[]; meta: { total: number; page: number; limit: number; totalPages: number }}> => {
    try {
        const { page, limit, skip } = getPagination(query || {});
        const search = query?.search;
        const isActive = query?.isActive?.trim();

        const where: any = {
            ...(!isAdmin && { isActive: true }),
            ...(isActive === 'false' && {isActive: false}),
            ...(isActive === 'true' && {isActive: true}),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                ]
            })
        };

        const [posDevices, total] = await Promise.all([
            prisma.posDevice.findMany({
                where,
                skip,
                take: limit,
            }),
            prisma.posDevice.count({ where })
        ]);
        return {
            data: posDevices,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }catch (error: any) {
        if (error.code !== 'P2002') throw error;
        throw new ProcessingError(error?.message || 'Failed to search all POS devices');
    }
};

const softDeletePosDevice = async(
    where: PosDeviceWhereUniqueInput
) => {
    await prisma.posDevice.update({ where, data: {isActive: false}});
};

const updatePosDevice = async(
    input: UpdatePosDeviceInput
): Promise<PosDevice> => {
    try {

        const validatedData = PaymentValidation.posDeviceUpdateSchema.parse(input);
        const serialNumber = validatedData.serialNumber;
        const posDevice = await prisma.posDevice.findUnique({ where: { serialNumber }});
        if (!posDevice) throw new NotFoundError('posDevice not found');

        const updatedData: any = {
            name: validatedData.name,
            serialNumber: validatedData.serialNumber
        };
        if (validatedData.isActive === true) {
            updatedData.isActive = true;
        } else if (validatedData.isActive === false) {
            updatedData.isActive = false;
        }

        const restored = await prisma.posDevice.update({
            where: {serialNumber},
            data: updatedData
        });

        return restored;
    } catch (error: any) {
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to restore posDevice');
    }
};

export default {
    createPOSDevice,
    getPOSDevice,
    listPOSDevices,
    softDeletePosDevice,
    updatePosDevice,
};