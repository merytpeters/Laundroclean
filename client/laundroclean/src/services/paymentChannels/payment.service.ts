import { paymentApi } from "src/lib/api/shared/payment/paymentApi";
import { InitiatePaymentPayload } from "src/types/financialtransactions/payment";
import { ApiResponse } from "src/lib/api/requests";
import { PaymentDto } from "src/types/financialtransactions/payment.dto";


export async function initiatePaymentService (payload: InitiatePaymentPayload): Promise<ApiResponse<PaymentDto> | null> {
    const res = await paymentApi.initiatePayment(payload);

    if (!res.success || !res.data || !res.message) return null;

    return res;
}