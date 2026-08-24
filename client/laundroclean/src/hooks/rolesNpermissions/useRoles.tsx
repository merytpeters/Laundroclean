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
import { RolePayload, UsersRoleResponse } from "src/types/roles/role";
import { useAuth } from "src/context/AuthContext";
import { toast } from "sonner";
import { ApiResponse } from "src/lib/api/requests";
import { RoleDto, RolesDto, UserRoleDto } from "src/types/roles/role.dto";


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

export function useRoles() {
    const { authUser } = useAuth();

    return useQuery<ApiResponse<RolesDto> | null>({
        queryKey: companyRolesKeys.list(),
        queryFn: () => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return getRolesService()
                }
            }
            throw new Error("Unsupported user type");
        }
    });
}