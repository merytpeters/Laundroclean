import { apiRequest } from "../../requests";
import { BankAccountPayload, BankAccountParams, UpdateBankAccountPayload } from "src/types/paymentChannels/bankAccount";
import { BankAccountDto, BankAccountsDto } from "src/types/paymentChannels/bankAccount.dto";


export const bankAccountApi = {
    createBankAccount: (payload: BankAccountPayload) =>
        apiRequest<BankAccountDto>("/company-bank-account", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listBankAccounts: (params?: BankAccountParams) =>
        apiRequest<BankAccountsDto>("/company-bank-account", {
            method: "GET",
            params: params,
        }),

    getBankAccountById: (id: string, params?: BankAccountParams) =>
        apiRequest<BankAccountDto>(`/company-bank-account/${id}`, {
            method: "GET",
            params: params,
        }),

    updateBankAccount: (id: string, payload: UpdateBankAccountPayload) =>
        apiRequest<BankAccountDto>(`/company-bank-account/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        })
}