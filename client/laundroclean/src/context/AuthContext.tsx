"use client";

import { 
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import type { User } from "src/types/users/user";
import { hasAccessToken } from "src/lib/api/auth-store";

type AuthContextType = {
    authUser: User | null;
    setAuthUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [authUser, setAuthUser] = useState<User | null>(null);

    const value = useMemo(
        () => ({
            authUser,
            setAuthUser,
            isAuthenticated: !!authUser || hasAccessToken(),
        }),
        [authUser]
    );

    return(
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>

    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context
}
