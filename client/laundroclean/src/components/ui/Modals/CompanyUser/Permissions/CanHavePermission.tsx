"use client";

import type { ReactNode } from "react";

import {
    useAuth,
} from "src/context/AuthContext";

import {
    hasPermission,
    type Permission,
} from '../../../../../types/roles/permissions';

interface CanProps {
    permission: Permission;
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({
    permission,
    children,
    fallback = null,
}: CanProps) {
    const { authUser } = useAuth();

    if ( authUser?.type === "COMPANYUSER") {

        const allowed = hasPermission(
        authUser?.role?.permissions,
        permission
    );

    if (!allowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;

    }
}