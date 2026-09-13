import asyncHandler, { type CompanyBankAccountQuery } from '../../../utils/asyncHandler.js';
import CompanybankaccountService from './companybankaccount.service.js';
import type { CompanyBankAccountSchema, UpdateCompanyBankAccountSchema } from '../../../validation/financialtransactions/companybankaccount.validation.js';

const createCompanyBankAccountController = asyncHandler(async (req, res) => {
    const newBankAccountData: CompanyBankAccountSchema = req.body;

    const newBankAccount = await CompanybankaccountService.createCompanyBankAccount(newBankAccountData);

    return res.status(201).json({
        success: true,
        message: `${newBankAccount.accountName} with account number ${newBankAccount.accountNumber} created successfully`,
        data: newBankAccount
    });
});


const listCompanyBankAccountsController = asyncHandler(async (req, res) => {
    const searchQuery = req?.query as unknown as CompanyBankAccountQuery;
    const isAdmin = req.user?.role?.title === 'ADMIN';

    const companyBankAccounts = await CompanybankaccountService.listCompanyBankAccounts(searchQuery, isAdmin);

    return res.status(200).json({
        success: true,
        message: 'Bank Accounts retrieved successfully',
        data: companyBankAccounts.data,
        meta: companyBankAccounts.meta
    });
});


const getCompanyBankAccountController = asyncHandler(async (req, res) => {
    const bankAccountId = req.params.id;

    const isAdmin = req.user?.role?.title === 'ADMIN';

    const companyBankAccount = await CompanybankaccountService.getCompanyBankAccount(bankAccountId, isAdmin);

    return res.status(200).json({
        success: true,
        message: 'Bank Account retrieved successfully',
        data: companyBankAccount,
    });
});


const updateCompanyBankAccountController = asyncHandler(async (req, res) => {
    const bankAccountId = req.params.id;
    const updatedBankAccountData: UpdateCompanyBankAccountSchema = req.body;

    const companyBankAccount = await CompanybankaccountService.updateCompanyBankAccount(updatedBankAccountData, bankAccountId);

    return res.status(200).json({
        success: true,
        message: 'Bank Account details updated successfully',
        data: companyBankAccount,
    });
});

export default {
    createCompanyBankAccountController,
    listCompanyBankAccountsController,
    getCompanyBankAccountController,
    updateCompanyBankAccountController,
};