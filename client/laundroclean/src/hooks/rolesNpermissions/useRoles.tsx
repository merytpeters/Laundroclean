"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyRolesKeys } from "./keys";
import {
    createRoleService,
    getRolesService,
    getUsersByRoleService,
    updateRoleService,
    deleteRoleService
} from "src/services/roleService/role.service";
import { RolePayload } from "src/types/roles/role";
import { useAuth } from "src/context/AuthContext";
import { toast } from "sonner";
import { ApiResponse } from "src/lib/api/requests";
import { RolesDto, UserRoleDto } from "src/types/roles/role.dto";
import { PaginationParamQuery } from "src/types/users/user";


type roleMutationVariables = {
    payload: RolePayload
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload,
        }: roleMutationVariables) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return createRoleService(payload)
                }
            }
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: companyRolesKeys.lists(),
            });
            toast.success(data?.message)
        }
    })

    return mutation
}

export function useRole(id: number) {
    const { authUser } = useAuth();

    return useQuery<ApiResponse<UserRoleDto> | null>({
        queryKey: companyRolesKeys.detail(id),
        queryFn: () => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return getUsersByRoleService(id)
                }
            }
            throw new Error("Unsupported user type");
        }
    });
}

export function useRoles(params?: PaginationParamQuery) {
    const { authUser } = useAuth();

    return useQuery<ApiResponse<RolesDto> | null>({
        queryKey: companyRolesKeys.list(params),
        queryFn: () => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return getRolesService(params)
                }
            }
            throw new Error("Unsupported user type");
        }
    });
}

export function useDeleteRole() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async(id: number) => {
            if (authUser?.type === "COMPANYUSER") {
                return deleteRoleService(id)
            } 
        },

        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: companyRolesKeys.lists(),
            });
            toast.success(data?.message)
        },

        onError(error) {
            toast.error(error.message);
        }
    })

    return mutation
}