import { CurrencyTypeValue } from "../laundrocleanServices/laundroservices";


export type TransactionStatusDto = 
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"

    
export type TransactionDto = {
    id: string;
    currency: CurrencyTypeValue;
    status: TransactionStatusDto;
    createdAt: string;
    updatedAt: string;
    userId: string;
    bookingId: string;
    paidAmount: number;
    platformFee: number;
    merchantAmount: number;
    paidAt: string | null;
    transactionRef: string;
}

export type PaymentChannelAndMethodDto = 
    | "BANKCARD"
    | "BANK_TRANSFER"
    | "OPAY_WALLET"
    | "POS"
    | "CASH"

export type PaymentStatusDto =
    | "INITIATED"
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "REVERSED"
    | "EXPIRED"
    | "ABANDONED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"
    | "PENDING_VERIFICATION"
    | "REJECTED"

export type PaymentProviderDto =
    | "PAYSTACK"
    | "OPAY"
    | "INTERNAL"


export type PaymentDto = {
    provider: PaymentProviderDto;
    status: PaymentStatusDto;
    amount: number;
    channel?: string;
    currency: CurrencyTypeValue;
    id: string;
    senderBankName?: string;
    senderAccountName?: string;
    senderTransactionRef?: string;
    transferredAt?: string;
    authorization?: Record<string, unknown>;
    transactionId: string;
    providerRef?: string;
    paidAt?: string;
    updatedAt: string;
    initiatedAt: string;
    companyBankAccountId?: string;
}