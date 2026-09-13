import z from 'zod';


const companyBankAccountSchema = z.object({
    bankName: z.string('Bank name is required'),
    accountName: z.string('Account Name is required'),
    accountNumber: z.string('Account number is required'),
    isDefault: z.boolean().optional()
});

export type CompanyBankAccountSchema = z.infer<typeof companyBankAccountSchema>


const updateCompanyBankAccountSchema = z.object({
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z
        .string()
        .min(6, 'Account number is too short')
        .max(34, 'Account number cannot exceed 34 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Invalid characters in account number')
        .optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional()
});

export type UpdateCompanyBankAccountSchema = z.infer<typeof updateCompanyBankAccountSchema>

export default {
    companyBankAccountSchema,
    updateCompanyBankAccountSchema
};