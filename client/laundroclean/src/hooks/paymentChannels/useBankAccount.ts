import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import { ApiResponse } from "src/lib/api/requests";
import {
    createBankAccountService,
    updateBankAccountService,
    listBankAccountsService,
    getBankAccountByIdService,
    clientGetBankAccountByIdService,
    clientListBankAccountsService
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
    params?: BankAccountParams
}

export function useBankAccounts({params }: BankAccountQuery) {
    const { authUser } = useAuth()
    return useQuery<ApiResponse<BankAccountsDto> | null>({
        queryKey: bankAccountKeys.list(params),
        queryFn: async () => {
            switch (authUser?.type) {
                case "COMPANYUSER":
                    return listBankAccountsService(params)
                case "CLIENT":
                    return clientListBankAccountsService(params)
            }

            throw new Error(
                "Unsupported user type"
            );
        },

    })
}

export function useBankAccount(id: string) {
    const { authUser } = useAuth()
    return useQuery<ApiResponse<BankAccountDto> | null>({
        queryKey: bankAccountKeys.detail(id),
        queryFn: async () => {
            switch (authUser?.type) {
                case "COMPANYUSER":
                    return getBankAccountByIdService(id)
                case "CLIENT":
                    return clientGetBankAccountByIdService(id)
            }

            throw new Error(
                "Unsupported user type"
            );
        },

    })
}
