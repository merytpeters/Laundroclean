import prisma from '../../../config/prisma.js';
import { Prisma, type CompanyBankAccount } from '@prisma/client';
import type { CompanyBankAccountSchema } from '../../../validation/financialtransactions/companybankaccount.validation.js';
import { NotFoundError, ProcessingError, ValidationError } from '../../../middlewares/errorHandler.js';
import z from 'zod';
import type { CompanyBankAccountQuery } from '../../../utils/asyncHandler.js';
import { getPagination } from '../../common/pagination/paginate.js';

type CompanyBankAccountCreateInput = Prisma.CompanyBankAccountCreateInput
// create

const createCompanyBankAccount = async (payload: CompanyBankAccountSchema): Promise<CompanyBankAccount> => {
    try {
        const createData: any = {
            bankName: payload.bankName,
            accountName: payload.accountName,
            accountNumber: payload.accountNumber,
        };
        if (payload.isDefault !== undefined) {
            createData.isDefault = payload.isDefault;
        }
        const companyBankAccount = await prisma.companyBankAccount.create({
            data: createData
        });
        return companyBankAccount;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(
                `Validation failed: ${error.issues.map(e => e.message).join(', ')}`
            );
        }
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to create bank account');
    }
};

// update

// view

// view all/ search
const listCompanyBankAccounts = async (
    query?: CompanyBankAccountQuery,
    isAdmin: boolean = false
): Promise<{data: CompanyBankAccount[]; meta: { total: number; page: number; limit: number; totalPages: number }}> => {
    try {
        const {page, limit, skip } = getPagination(query || {});
        const search = query?.search;
        const isActive = query?.isActive?.trim();
        const isDefault = query?.isDefault?.trim();

        const where: any = {
            ...(!isAdmin && {isActive: true}),
            ...(isActive === 'false' && {isActive: false}),
            ...(isActive === 'true' && {isActive: true}),
            ...(isDefault === 'false' && {isDefault: false}),
            ...(isDefault === 'true' && {isDefault: true}),
            ...(search && {
                OR: [
                    { bankName: { contains: search, mode: 'insensitive' } },
                    { accountNumber: { contains: search} },
                    { accountName: { contains: search, mode: 'insensitive' } },
                ]
            })
        };
        const [companyBankAccounts, total] = await Promise.all([
            prisma.companyBankAccount.findMany({
                where,
                skip,
                take: limit,
            }),
            prisma.companyBankAccount.count({ where })
        ]);

        return {
            data: companyBankAccounts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error: any) {
        if (error.code !== 'P2002') throw error;
        throw new ProcessingError(error?.message || 'Failed to search all Company bank accounts');
    }
};


// soft delete

export default {
    createCompanyBankAccount,
    listCompanyBankAccounts
};