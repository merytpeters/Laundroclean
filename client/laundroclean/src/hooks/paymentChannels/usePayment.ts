import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initiatePaymentService } from "src/services/paymentChannels/payment.service";
import { InitiatePaymentPayload } from "src/types/financialtransactions/payment";
import { PaymentDto } from "src/types/financialtransactions/payment.dto";
import { paymentKeys } from "./keys";
import { toast } from "sonner";


type InitiatePaymentVariables = {
    payload: InitiatePaymentPayload;
}

export function useInitiatePayment() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: InitiatePaymentVariables) => {
            return initiatePaymentService(payload);
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: paymentKeys.lists(),
            });
            toast.success(data?.message)
        },

        onError(error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong'
            );
        }
    });

    return mutation;
}