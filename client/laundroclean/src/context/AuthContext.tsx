"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import type { User, ProfileResponse } from "src/types/users/user";
import { hasAccessToken } from "src/lib/api/auth-store";
import { useCurrentUser } from "src/hooks/profile/useProfile";

type AuthContextType = {
    authUser: User | null;
    setAuthUser: (user: User | null) => void;
    authProfile: ProfileResponse | null;
    setAuthProfile: (profile: ProfileResponse | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    refetch: ReturnType<typeof useCurrentUser>["refetch"];
    isError: boolean;
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
