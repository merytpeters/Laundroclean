import { apiRequest } from "../../requests";
import { InitiatePaymentPayload } from "src/types/financialtransactions/payment";
import { PaymentDto } from "src/types/financialtransactions/payment.dto";

export const paymentApi = {
    initiatePayment: (payload: InitiatePaymentPayload) =>
        apiRequest<PaymentDto>("/payments/initiate", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
}