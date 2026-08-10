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

import { useEffect, useState } from "react";
import { SelectOption } from "src/components/ui/Forms/AuthForms";
import { RolePayload } from "src/types/roles/role";
import { useAuth } from "src/context/AuthContext";
import { toast } from "sonner";


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

export function useRoles () {
    const [data, setData] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() =>{
            setData([
                {label: "Admin", value: "admin"},
                {label: "Staff", value: "staff"},
                {label: "Cashier", value: "cashier"},
            ]);
            setLoading(false)
        }, 500);
        return () => clearTimeout(timeout);
    }, [])
    return { data, loading}
}