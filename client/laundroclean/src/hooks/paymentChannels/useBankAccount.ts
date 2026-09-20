import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import { ApiResponse } from "src/lib/api/requests";
import {
    createBankAccountService,
    updateBankAccountService,
    listBankAccountsService,
    getBankAccountByIdService
} from "src/services/paymentChannels/bankAccount.service";
import { BankAccountParams, BankAccountPayload } from "src/types/paymentChannels/bankAccount";
import { bankAccountKeys } from "./keys";
import { toast } from "sonner";
import { BankAccountDto, BankAccountsDto } from "src/types/paymentChannels/bankAccount.dto";

type CreateBankAccountVariables = {
    payload: BankAccountPayload;
}

export function useCreateBankAccount() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: CreateBankAccountVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                return createBankAccountService(payload)
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: bankAccountKeys.lists(),
            })
            toast.success(data?.message)
        }
    })
    return mutation
}

type BankAccountQuery = {
    id?: string;
    params?: BankAccountParams
}

export function useBankAccounts({ id, params }: BankAccountQuery) {
    return useQuery<ApiResponse<BankAccountDto | BankAccountsDto> | null>({
        queryKey: id
            ? bankAccountKeys.detail(id)
            : bankAccountKeys.list(params),
        queryFn: () =>
            id
                ? getBankAccountByIdService(id, params)
                : listBankAccountsService(params)
    })
}
