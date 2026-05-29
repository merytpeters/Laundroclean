"use client";

import React, {useState} from "react";
import ClientLayout from "src/components/layouts/ClientUser/Clientlayout";
import { mockClient } from "src/lib/clientuser/mock";


export default function ClientDashboardLayout ({
    children,
}: {
    children: React.ReactNode
}) {
    
    return (
        <ClientLayout
           user={mockClient}
           welcomeMessage={{ name: "Client Name"}}
        >
            { children }
        </ClientLayout>
    )
}