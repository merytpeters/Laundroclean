"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
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
    const resolvedAuthUser = data?.user ?? authUser;
    const resolvedAuthProfile = data?.profile ?? authProfile;
    const attemptedHydrationRef = useRef(false);

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

    useEffect(() => {
        if (isLoading) return;

        if (!hasAccessToken()) {
            attemptedHydrationRef.current = false;
            return;
        }

        if (data) {
            attemptedHydrationRef.current = false;
            return;
        }

        if (attemptedHydrationRef.current) return;

        attemptedHydrationRef.current = true;
        void refetch();
    }, [data, isLoading, refetch]);

    const hasPermission = useCallback(
        (permission: Permission): boolean => {
            // Clients don't use role permissions
            if (resolvedAuthUser?.type !== "COMPANYUSER") {
                return false;
            }

            return checkPermission(
                resolvedAuthUser.role?.permissions,
                permission
            );
        },
        [resolvedAuthUser]
    );

    const value = useMemo(
        () => ({
            authUser: resolvedAuthUser,
            setAuthUser,
            isAuthenticated: !!resolvedAuthUser || hasAccessToken(),
            authProfile: resolvedAuthProfile,
            setAuthProfile,
            isLoading,
            refetch,
            isError,
            hasPermission,
        }),
        [resolvedAuthUser, resolvedAuthProfile, isLoading, refetch, isError, hasPermission]
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
