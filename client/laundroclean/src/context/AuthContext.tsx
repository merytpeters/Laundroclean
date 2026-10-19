"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import type { User, ProfileResponse } from "src/types/users/user";
import { hasAccessToken } from "src/lib/api/auth-store";
import { useCurrentUser } from "src/hooks/profile/useProfile";
import {
    type Permission,
    hasPermission as checkPermission,
} from '../types/roles/permissions';

type AuthContextType = {
    authUser: User | null;
    setAuthUser: (user: User | null) => void;
    authProfile: ProfileResponse | null;
    setAuthProfile: (profile: ProfileResponse | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    refetch: ReturnType<typeof useCurrentUser>["refetch"];
    isError: boolean;
    hasPermission: (
        permission: Permission
    ) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [authProfile, setAuthProfile ] = useState<ProfileResponse | null>(null);
    const { data, isLoading, refetch, isError } = useCurrentUser();

    useEffect(() => {
        if (!data) return;

        setAuthUser(data.user);
        setAuthProfile(data.profile);
    }, [data]);

    useEffect(() => {
        if (isLoading) return;
        if (data) return;
        if (hasAccessToken()) return;

        setAuthUser(null);
        setAuthProfile(null);
    }, [data, isLoading]);

    const hasPermission = useCallback(
        (permission: Permission): boolean => {
            // Clients don't use role permissions
            if (authUser?.type !== "COMPANYUSER") {
                return false;
            }

            return checkPermission(
                authUser.role?.permissions,
                permission
            );
        },
        [authUser]
    );

    const value = useMemo(
        () => ({
            authUser,
            setAuthUser,
            isAuthenticated: !!authUser || hasAccessToken(),
            authProfile,
            setAuthProfile,
            isLoading,
            refetch,
            isError,
            hasPermission,
        }),
        [authUser, authProfile, isLoading, refetch, isError]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context
}
