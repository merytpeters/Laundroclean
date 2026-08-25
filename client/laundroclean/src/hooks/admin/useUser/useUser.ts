import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { adminGetUsersService, adminGetUserService, adminUpdateUserStatus } from "src/services/userService/user.service";
import { adminUseUserKeys } from "./keys";
import { UserProfileDto } from "src/types/users/user.dto";
import { ApiResponse } from "src/lib/api/requests";
import { GetUsersParams, UpdateUserStatusPayload } from "src/types/users/user";
import { useAuth } from "src/context/AuthContext";
import { toast } from "sonner";

export function useAdminGetUser(id: string) {
    return useQuery<ApiResponse<UserProfileDto> | null>({
        queryKey: adminUseUserKeys.detail(id),
        queryFn: () => adminGetUserService(id)
    })
}

type GetUserTypeVariable = {
    type: "CLIENT" | "COMPANYUSER"
}

export function useAdminGetUsers({ type }: GetUserTypeVariable, params?: GetUsersParams) {
    return useQuery<ApiResponse<UserProfileDto[]> | null>({
        queryKey: adminUseUserKeys.list({ ...params, type }),
        queryFn: () => adminGetUsersService(params),
        select: (result) => {
            if (!result) return null;

            return {
                ...result,
                data: result.data?.filter(
                    (user) => user.user.type === type
                ) ?? [],
            };
        }
    })
}

type UpdateUserStatusVariable = {
    id: string;
    payload: UpdateUserStatusPayload;
}

export function useAdminUpdateUserStatus() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            id,
            payload
        }: UpdateUserStatusVariable) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminUpdateUserStatus(id, payload)
                }
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: adminUseUserKeys.lists(),
            });
            toast.success(data?.message)
        }
    })
    return mutation
}
