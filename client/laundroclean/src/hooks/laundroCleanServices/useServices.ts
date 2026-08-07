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
import { AllServicesParams, GetActiveServicesParams, PublicServicesParams, ServicePayload, ServicePricePayload } from "src/types/laundrocleanServices/laundroservices";
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
            ? laundrocleanServicesKeys.services.detail(id)
            : laundrocleanServicesKeys.services.list(params),
        queryFn: () =>
            id
                ? publicGetServiceById(id)
                : publicGetServicesService(params)
    })
}

type CreateServiceVariables = {
    service: ServicePayload;
    servicePrice?: ServicePricePayload
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
                queryKey: laundrocleanServicesKeys.services.list(),
            });
            toast.success(data?.message)
        }
    })

    return mutation
}

type ServiceQuery = {
    params?: PublicServicesParams | AllServicesParams | GetActiveServicesParams;
}

export function useServices({ params }: ServiceQuery) {
    const { authUser } = useAuth();
    return useQuery<ApiResponse<ServicesDto> | null>({
        queryKey: laundrocleanServicesKeys.services.list(params),
        queryFn: () => {
            switch (authUser?.type) {
                case 'CLIENT':
                    return clientGetServicesService(params)

                case 'COMPANYUSER':
                    switch (authUser.uiRole) {
                        case 'ADMIN':
                            return adminGetActiveServicesService(params)

                        case 'STAFF':
                            return staffGetActiveServicesService(params)
                    }
            }
            throw new Error("Unsupported user type");
        }

    });
}


export function useService(id: string) {
    const { authUser } = useAuth();
    return useQuery<ApiResponse<ServiceDto> | null>({
        queryKey: laundrocleanServicesKeys.services.detail(id),
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