import prisma from '../../../config/prisma.js';
import { Prisma, type CompanyBankAccount } from '@prisma/client';
import { NotFoundError, ProcessingError, UnauthorizedError, ValidationError } from '../../../middlewares/errorHandler.js';
import z from 'zod';
import type { CompanyBankAccountQuery } from '../../../utils/asyncHandler.js';
import { getPagination } from '../../common/pagination/paginate.js';
import type { UpdateCompanyBankAccountSchema } from '../../../validation/financialtransactions/companybankaccount.validation.js';

type CompanyBankAccountCreateInput = Prisma.CompanyBankAccountCreateInput;
type CompanyBankAccountWhereUniqueInput = Prisma.CompanyBankAccountWhereUniqueInput;
type CompanyBankAccountUpdateInput = Prisma.CompanyBankAccountUpdateInput;
// create

const createCompanyBankAccount = async (payload: CompanyBankAccountCreateInput): Promise<CompanyBankAccount> => {
    try {
        const createData: any = {
            bankName: payload.bankName,
            accountName: payload.accountName,
            accountNumber: payload.accountNumber,
            isDefault: payload.isDefault
        };
        if (payload.isDefault === true) {
            createData.isDefault = payload.isDefault;
            const [_, newDefaultBankAccount] = await prisma.$transaction([
                prisma.companyBankAccount.updateMany({
                    where: { isDefault: true },
                    data: { isDefault: false }
                }),
                prisma.companyBankAccount.create({
                    data: createData
                })
            ]);
            return newDefaultBankAccount;
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
const updateCompanyBankAccount = async (
    payload: UpdateCompanyBankAccountSchema,
    where: CompanyBankAccountWhereUniqueInput,
): Promise<CompanyBankAccount> => {
    try {
        const companyBankAccount = await prisma.companyBankAccount.findUnique({
            where
        });

        if (!companyBankAccount) throw new NotFoundError('Bank Account not found');

        const data: CompanyBankAccountUpdateInput = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined)
        );

        if (payload.isDefault === true) {
            data.isDefault = payload.isDefault;
            const [_, newDefaultBankAccount] = await prisma.$transaction([
                prisma.companyBankAccount.updateMany({
                    where: { isDefault: true },
                    data: { isDefault: false }
                }),
                prisma.companyBankAccount.update({
                    where,
                    data
                })
            ]);
            return newDefaultBankAccount;
        }

        const updatedCompanyBankAccount = await prisma.companyBankAccount.update({
            where,
            data
        });

        return updatedCompanyBankAccount;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(`Validation failed: ${error.issues.map(e => e.message).join(', ')}`);
        }
        if (error instanceof NotFoundError) throw error;
        throw new ProcessingError(error?.message || 'Failed to update bank account details');
    }
};

// view
const getCompanyBankAccount = async (
    where: CompanyBankAccountWhereUniqueInput,
    isAdmin: boolean = false
): Promise<CompanyBankAccount> => {
    const companyBankAccount = await prisma.companyBankAccount.findUnique({
        where
    });

    if (!companyBankAccount) throw new NotFoundError('Bank Account not found');

    if (companyBankAccount.isActive !== true && !isAdmin) {
        throw new UnauthorizedError('Not allowed to view this inactive bank account');
    }

    return companyBankAccount;
};

// view all/ search
const listCompanyBankAccounts = async (
    query?: CompanyBankAccountQuery,
    isAdmin: boolean = false
): Promise<{ data: CompanyBankAccount[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    try {
        const { page, limit, skip } = getPagination(query || {});
        const search = query?.search;
        const isActive = query?.isActive?.trim();
        const isDefault = query?.isDefault?.trim();

        const where: any = {
            ...(!isAdmin && { isActive: true }),
            ...(isActive === 'false' && { isActive: false }),
            ...(isActive === 'true' && { isActive: true }),
            ...(isDefault === 'false' && { isDefault: false }),
            ...(isDefault === 'true' && { isDefault: true }),
            ...(search && {
                OR: [
                    { bankName: { contains: search, mode: 'insensitive' } },
                    { accountNumber: { contains: search } },
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


export default {
    createCompanyBankAccount,
    listCompanyBankAccounts,
    getCompanyBankAccount,
    updateCompanyBankAccount
};