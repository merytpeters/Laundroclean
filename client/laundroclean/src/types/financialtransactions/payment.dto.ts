import { CurrencyTypeValue } from "../laundrocleanServices/laundroservices";


export type TransactionStatus = 
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"

    
export type TransactionDto = {
    id: string;
    currency: CurrencyTypeValue;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    bookingId: string;
    paidAmount: number;
    platformFee: number;
    merchantAmount: number;
    paidAt: Date | null;
    transactionRef: string;
}