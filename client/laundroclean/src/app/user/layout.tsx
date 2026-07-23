"use client";

import React from "react";
import { redirect } from "next/navigation";
import ClientLayout from "src/components/layouts/ClientUser/Clientlayout";
import { useCurrentUser } from "src/hooks/profile/useProfile";
import { mockClient } from "src/services/clientuser/mock";
// import ProtectedRoute from "src/components/ui/ProtectedRoutes";


export default function ClientDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const userProfile = useCurrentUser();
    const user = userProfile.data?.user || mockClient;

    if (!user || user.type !== "CLIENT") {
        redirect("/login");
    }

    return (
        // <ProtectedRoute>
            <ClientLayout
                user={user}
                welcomeMessage={{ name: user?.firstName || user?.lastName || "Client" }}
            >
                {children}
            </ClientLayout>
        // </ProtectedRoute>
    )
}