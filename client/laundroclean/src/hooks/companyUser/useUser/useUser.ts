import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { adminGetUsersService, adminGetUserService, adminUpdateUserStatus, staffGetUsersService } from "src/services/userService/user.service";
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
    type?: "CLIENT" | "COMPANYUSER"
}

export function useGetUsers(
    { type }: GetUserTypeVariable,
    params?: GetUsersParams,
    options?: {
        enabled?: boolean;
    }
) {
    const { authUser } = useAuth();

    return useQuery<ApiResponse<UserProfileDto[]> | null>({
        queryKey: adminUseUserKeys.list({ ...params, type }),
        queryFn: () => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminGetUsersService(params)
                }
                return staffGetUsersService(params)
            }
            return null;
        },
        enabled: options?.enabled ?? true,
        select: (result) => {
            if (!result) return null;

            return {
                ...result,
                data: type
                    ? result.data?.filter(
                          (user) => user.user.type === type
                      ) ?? []
                    : result.data ?? [],
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
