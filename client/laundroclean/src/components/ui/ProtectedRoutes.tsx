"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "src/context/AuthContext";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const {isAuthenticated } = useAuth();

    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.replace("/login");
        }
    }, [mounted, isAuthenticated, router]);

    if (!mounted || !isAuthenticated) {
        return null;
    }

    return children;
}