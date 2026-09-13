import { ApiResponse } from "src/lib/api/requests";
import { bankAccountApi } from "src/lib/api/shared/paymentChannels/bankAccountApi";
import { BankAccountPayload, BankAccountQuery, UpdateBankAccountPayload } from "src/types/paymentChannels/bankAccount";
import { BankAccountDto, BankAccountsDto } from "src/types/paymentChannels/bankAccount.dto";

export async function createBankAccountService (payload: BankAccountPayload): Promise<ApiResponse<BankAccountDto> | null> {
    const res = await bankAccountApi.createBankAccount(payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function listBankAccountsService (params?: BankAccountQuery): Promise<ApiResponse<BankAccountsDto> | null> {
    const res = await bankAccountApi.listBankAccounts(params);

    if (!res.success || !res.data ||!res.meta) return null;

    return res
}

export async function getBankAccountByIdService (id: string): Promise<ApiResponse<BankAccountDto> | null> {
    const res = await bankAccountApi.getBankAccountById(id);

    if (!res.success || !res.data) return null;

    return res
}

export async function updateBankAccountService (id: string, payload: UpdateBankAccountPayload): Promise<ApiResponse<BankAccountDto> | null> {
    const res = await bankAccountApi.updateBankAccount(id, payload);

    if (!res.success || !res.data) return null;

    return res
}