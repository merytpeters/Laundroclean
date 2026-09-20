import { CurrencyTypeValue } from "../laundrocleanServices/laundroservices";
import { POSDevicePayload } from "../paymentChannels/posDevices";
import { PaymentChannelAndMethodDto, PaymentProviderDto, PaymentStatusDto } from "./payment.dto";


export type BankDetailsPayload = {
    senderBankName: string;
    senderAccountName: string;
    senderTransactionRef: string;
    transferredAt: string;
}

export type UserInfoPayload = {
    customerName: string;
    UserPhone: string;
    email: string;
    userMobile: string;
}

export type CardPayload = {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolderName: string;
}

export type InitiatePaymentPayload = {
    bookingId: string;
    userId: string;
    provider: PaymentProviderDto;
    status: PaymentStatusDto;
    amount: number;
    channel: PaymentChannelAndMethodDto;
    currency: CurrencyTypeValue;
    card?: CardPayload;
    userInfo?: UserInfoPayload;
    sn?: POSDevicePayload;
    bankDetails?: BankDetailsPayload;
    companyBankAccountId?: string;
}

export type CashMethodFormValues =
    Omit<InitiatePaymentPayload, "card" | "userInfo" | "sn" | "bankDetails" | "companyBankAccountId">

export type CardMethodFormValues =
    Omit<InitiatePaymentPayload, "sn" | "bankDetails" | "userInfo" |"companyBankAccountId">

export type OpayPOSMethodFormValues =
    Omit<InitiatePaymentPayload, "bankDetails" |"companyBankAccountId" | "card">

export type OpayBankTransferFormValues =
    Omit<InitiatePaymentPayload, "sn" | "card">

export type BankTransferFormValues =
    Omit<InitiatePaymentPayload, "sn" | "card" | "userInfo">