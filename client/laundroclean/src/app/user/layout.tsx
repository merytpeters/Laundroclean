"use client";

import React from "react";
import ClientLayout from "src/components/layouts/ClientUser/Clientlayout";
import ProtectedRoute from "src/components/ui/ProtectedRoutes";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { useAuth } from "src/context/AuthContext";


export default function ClientDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { authUser, isLoading, refetch, isError } = useAuth();

    if (isLoading) {
        return (
            <LoadingState />
        )
    }

    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        );
    }

    if (!authUser || authUser.type !== "CLIENT") {
        return null;
    }

    return (
        <ProtectedRoute>
            <ClientLayout
                user={authUser}
                welcomeMessage={{ name: authUser?.firstName || authUser?.lastName || "Client" }}
            >
                {children}
            </ClientLayout>
        </ProtectedRoute>
    )
}