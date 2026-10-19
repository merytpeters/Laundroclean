import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createPOSDeviceService,
    listPOSDevicesService,
    updatePOSDeviceService,
    restorePOSDeviceService,
    getPOSDeviceByIdService,
    softDeletePOSDeviceService
} from "src/services/paymentChannels/posDevices.service";
import { POSDevicePayload, UpdatePOSDevicePayload, RestorePOSDevicePayload } from "src/types/paymentChannels/posDevices";
import { ByActiveParam } from "src/types/pagination";
import { useAuth } from "src/context/AuthContext";
import { bankAccountKeys, posDeviceKeys } from "./keys";
import { toast } from "sonner";
import { ApiResponse } from "src/lib/api/requests";
import { POSDeviceDto, POSDevicesDto } from "src/types/paymentChannels/posDevices.dto";

type CreatePOSDeviceVariables = {
    payload: POSDevicePayload;
}

export function useCreatePOSDevice() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: CreatePOSDeviceVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                return createPOSDeviceService(payload)
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: posDeviceKeys.lists(),
            })
            toast.success(data?.message)
        }
    })
    return mutation
}

type POSDeviceQuery = {
    id?: string;
    params?: ByActiveParam;
}

export function usePOSDevices({ id, params }: POSDeviceQuery) {
    return useQuery<ApiResponse<POSDeviceDto | POSDevicesDto> | null>({
        queryKey: id
            ? posDeviceKeys.detail(id)
            : posDeviceKeys.list(params),
        queryFn: () =>
            id
                ? getPOSDeviceByIdService(id)
                : listPOSDevicesService(params)
    })
}