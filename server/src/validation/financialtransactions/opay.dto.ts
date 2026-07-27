export type InitializePaymentBaseDto = {
    amount: {
        currency: string;
        total: number;
    },
    callbackUrl: string;
    country: string;
    product: {
        description: string;
        name: string;
    },
    reference: string;
    payMethod: string;
}

export type InitializePaymentBankCardMethodDto = InitializePaymentBaseDto & {
    bankcard: {
        cardHolderName: string;
        cardNumber: string;
        cvv: string;
        enable3DS: boolean;
        expiryMonth: string;
        expiryYear: string;
    },
    returnUrl: string;
}

export type IntializePaymentForPOSMethodDto = InitializePaymentBaseDto & {
    customerName: string;
    sn: string;
    userPhone: string;
}

export type InitializePaymentBankTransferMethodDto = InitializePaymentBaseDto & {
    customerName: string;
    userInfo: {
        userEmail: string;
        userId: string;
        userName: string;
        userMobile: string;
    }
    userPhone: string;
}

export type InitializePaymentDto = {
    amount: {
        currency: string;
        total: number;
    },
    callbackUrl: string;
    country: string;
    product: {
        description: string;
        name: string;
    },
    reference: string;
    payMethod: string;
    bankcard: {
        cardHolderName: string;
        cardNumber: string;
        cvv: string;
        enable3DS: boolean;
        expiryMonth: string;
        expiryYear: string;
    } | undefined,
    returnUrl?: string;
    customerName?: string;
    sn?: string;
    userPhone?: string;
    userInfo?: {
        userEmail: string;
        userId: string;
        userName: string;
        userMobile: string;
    }
}

type opayPaymentStatus = 'INITIAL' | 'PENDING' | 'SUCCESS' | 'FAIL' | 'CLOSE'

type opayBankTransferNextActionDto = {
    actionType: string;
    transferAccountNumber: string;
    transferBankName: string;
    expiredTimestamp: string;
}

type opayPOSNextActionDto = {
    actionType: string;
}

type opayCardNextActionDto = {
    actionType: string;
    redirectUrl: string;
}

type opayWalletNextActionDto = {
    actionType: string;
    qrCode: string;
}

type NextAction = opayBankTransferNextActionDto | opayCardNextActionDto | opayPOSNextActionDto | opayWalletNextActionDto

export type OpayResponseDto = {
    code: string;
    message: string;
    data: {
        reference: string;
        orderNo: string;
        nextAction: NextAction,
        status: opayPaymentStatus;
        amount: {
            total: number;
            currency: string;
        }
        vat: {
            total: number;
            currency: string;
        }
    }
}

/*export type OpayErrorResponseDto = {

}*/