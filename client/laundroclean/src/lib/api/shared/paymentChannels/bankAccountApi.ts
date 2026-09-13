import { apiRequest } from "../../requests";
import { BankAccountPayload, BankAccountQuery, UpdateBankAccountPayload } from "src/types/paymentChannels/bankAccount";
import { BankAccountDto, BankAccountsDto } from "src/types/paymentChannels/bankAccount.dto";


export const bankAccountApi = {
    createBankAccount: (payload: BankAccountPayload) =>
        apiRequest<BankAccountDto>("/company-bank-account", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listBankAccounts: (params?: BankAccountQuery) =>
        apiRequest<BankAccountsDto>("/company-bank-account", {
            method: "GET",
            params: params,
        }),

    getBankAccountById: (id: string) =>
        apiRequest<BankAccountDto>(`/company-bank-account/${id}`),

    updateBankAccount: (id: string, payload: UpdateBankAccountPayload) =>
        apiRequest<BankAccountDto>(`/company-bank-account/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        })
}