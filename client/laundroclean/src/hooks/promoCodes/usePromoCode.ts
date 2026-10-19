import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import { 
    adminGetPromoCodeByIdService,
    adminCreatePromoCodeService,
    adminGetPromoCodeListService,
    adminDeactivatePromoCodeById,
    adminUpdatePromoCodeById,
    adminReactivatePromoCodeById
} from "src/services/promoService/promo.services";
import { PromoCodePayload, UpdatePromoCodePayload } from "src/types/laundrocleanServices/promoCode";
import { promoCodeKeys } from "./keys";
import { laundrocleanServicesKeys } from "../laundroCleanServices/keys";
import { toast } from "sonner";
import { ApiResponse } from "src/lib/api/requests";
import { PromoCodeDto } from "src/types/laundrocleanServices/promoCode.dto";

type CreatePromoCodeVariables = {
    payload: PromoCodePayload
}

export function useCreatePromoCode() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: CreatePromoCodeVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminCreatePromoCodeService(payload)
                }
            }
        },

        onSuccess: async(data) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: promoCodeKeys.lists()
                }),
                queryClient.invalidateQueries({
                    queryKey: laundrocleanServicesKeys.lists()
                })
            ])
            toast.success(data?.message)
        }
    });

    return mutation
}

type UpdatePromoCodeVariables = {
    id: string;
    payload: UpdatePromoCodePayload;
}

export function useUpdatePromoCode() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            id
        ,    payload
        }: UpdatePromoCodeVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminUpdatePromoCodeById(id, payload)
                }
            }
        },

        onSuccess: async(data) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: promoCodeKeys.lists()
                }),
                queryClient.invalidateQueries({
                    queryKey: laundrocleanServicesKeys.lists()
                }),
            ])
            toast.success(data?.message)
        }
    });

    return mutation
}

export function usePromoCodes(id?:string) {
    return useQuery<ApiResponse<PromoCodeDto | PromoCodeDto[]> | null>({
        queryKey: id
            ? promoCodeKeys.detail(id)
            : promoCodeKeys.lists(),
        queryFn: () =>
            id
                ? adminGetPromoCodeByIdService(id)
                : adminGetPromoCodeListService()
    })
}

export function useDeactivatePromoCode() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminDeactivatePromoCodeById(id)
                }
            }
        },

        onSuccess: async(data) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: promoCodeKeys.lists()
                }),
                queryClient.invalidateQueries({
                    queryKey: laundrocleanServicesKeys.lists()
                }),
            ])
            toast.success(data?.message)
        }
    });

    return mutation
}

export function useReactivatePromoCode() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminReactivatePromoCodeById(id)
                }
            }
        },

        onSuccess: async(data) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: promoCodeKeys.lists()
                }),
                queryClient.invalidateQueries({
                    queryKey: laundrocleanServicesKeys.lists()
                }),
            ])
            toast.success(data?.message)
        }
    });

    return mutation
}