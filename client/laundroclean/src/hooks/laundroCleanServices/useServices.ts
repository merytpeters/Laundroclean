import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createServicePriceService,
    adminCreateLCServiceService,
    adminGetActiveServiceByIdService,
    adminGetActiveServicesService,
    adminUpdateServceByIdService,
    adminSearchAllServicesService,
    adminDeactivateMultipleServices,
    adminGetActiveorInactiveServiceByIdServices,
    adminRestoreMuulitpleServices,
    adminRestoreServiceById,
    clientGetServicesService,
    clientGetServiceByIdService,
    publicGetServiceById,
    publicGetServicesService,
    staffCreateLCServiceService,
    staffGetActiveServicesService,
    staffGetActiveServiceByIdService,
    staffUpdateServceByIdService,
} from "src/services/laundrocleanservices/laundrocleanservices.service";
import { laundrocleanServicesKeys } from "./keys";
import { ActivateOrDeactivateServicesPayload, AllServicesParams, GetActiveServicesParams, PublicServicesParams, ServiceIdPayload, ServicePayload, ServicePricePayload, UpdateServicePayload } from "src/types/laundrocleanServices/laundroservices";
import { ServiceDto, ServicesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { toast } from "sonner";
import { ApiResponse } from "src/lib/api/requests";
import { useAuth } from "src/context/AuthContext";


/**
 * LaundrocleanServices Hook
 */
type PublicServiceQuery = {
    id?: string;
    params?: PublicServicesParams
}

export function useGetServicesForPublic({ id, params }: PublicServiceQuery = {}) {
    return useQuery<ApiResponse<ServiceDto | ServicesDto> | null>({
        queryKey: id
            ? laundrocleanServicesKeys.detail(id)
            : laundrocleanServicesKeys.list(params),
        queryFn: () =>
            id
                ? publicGetServiceById(id)
                : publicGetServicesService(params)
    })
}

type CreateServiceVariables = {
    service: ServicePayload;
    servicePrice?: ServicePricePayload;
}


export function useCreateService() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            service,
            servicePrice
        }: CreateServiceVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminCreateLCServiceService(service, servicePrice)
                }
                return staffCreateLCServiceService(service, servicePrice)
            }
        },

        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: laundrocleanServicesKeys.lists(),
            });
            toast.success(data?.message)
        }
    })

    return mutation
}

type ServiceQueryPayload = {
    params?: PublicServicesParams | AllServicesParams | GetActiveServicesParams;
}

export function useServices({ params }: ServiceQueryPayload) {
    const { authUser } = useAuth();
    return useQuery<ApiResponse<ServicesDto> | null>({
        queryKey: laundrocleanServicesKeys.list(params),
        queryFn: async () => {
            switch (authUser?.type) {
                case "CLIENT":
                    return clientGetServicesService(
                        params
                    );

                case "COMPANYUSER":
                    switch (authUser.uiRole) {
                        case "ADMIN":
                            return adminSearchAllServicesService(
                                params
                            );

                        case "STAFF":
                            return staffGetActiveServicesService(
                                params
                            );
                    }
            }

            throw new Error(
                "Unsupported user type"
            );
        },
    });
}


export function useService(id: string) {
    const { authUser } = useAuth();
    return useQuery<ApiResponse<ServiceDto> | null>({
        queryKey: laundrocleanServicesKeys.detail(id),
        queryFn: () => {
            switch (authUser?.type) {
                case 'CLIENT':
                    return clientGetServiceByIdService(id)

                case 'COMPANYUSER':
                    switch (authUser.uiRole) {
                        case 'ADMIN':
                            return adminGetActiveServiceByIdService(id)

                        case 'STAFF':
                            return staffGetActiveServiceByIdService(id)
                    }
            }
            throw new Error("Unsupported user type");
        }

    });
}

type UpdateServiceVariables = {
    id: string;
    payload: UpdateServicePayload;
    servicePricePayload?: ServicePricePayload
}

export function useUpdateService() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async({
            id,
            payload,
            servicePricePayload
        }: UpdateServiceVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminUpdateServceByIdService(id, payload, servicePricePayload);
                }
                return staffUpdateServceByIdService(id, payload, servicePricePayload);
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: laundrocleanServicesKeys.lists(),
            });
            toast.success(data?.message)
        }
    })
    return mutation
}


type ActivateOrDeactivateVariables = {
    idPayload: ActivateOrDeactivateServicesPayload
}

export function useReactiveServices() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({ idPayload }: ActivateOrDeactivateVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminRestoreMuulitpleServices(idPayload)
                }
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: laundrocleanServicesKeys.lists(),
            });
            toast.success(data?.message)
        }
    })
    return mutation

}


export function useDeactiveServices() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({ idPayload }: ActivateOrDeactivateVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminDeactivateMultipleServices(idPayload)
                }
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: laundrocleanServicesKeys.lists(),
            });
            toast.success(data?.message)
        }
    })
    return mutation
}