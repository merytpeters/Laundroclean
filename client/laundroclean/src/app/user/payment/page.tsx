"use client";

import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import { useAuth } from "src/context/AuthContext";


export default function ClientPayment() {
    const { authUser, authProfile, isLoading, isError, refetch } = useAuth();

    if (isLoading) return <FaSpinner />;
    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        )
    }

    if (!authUser || !authProfile) {
        return null;
    }
    return (
        <div style={{ color: "black", flexShrink: 1, width: "100%", }}>
            <PaymentModal user={authUser} />
        </div>
    )
}