import { ByActiveParam } from "../pagination";

export type BankAccountPayload = {
    bankName: string;
    accountName: string;
    accountNumber: string;
    isDefault: boolean;
}

export type UpdateBankAccountPayload = {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    isDefault?: boolean;
    isActive?: boolean;
}

export interface BankAccountParams extends ByActiveParam {
  isDefault?: true | false;
}