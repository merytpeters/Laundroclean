"use client";

import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import { useAuth } from "src/context/AuthContext";
import { useSearchParams } from "next/navigation";


export default function ClientPayment() {
    const { authUser, authProfile, isLoading, isError, refetch } = useAuth();
    const search = useSearchParams();
    const bookingId = search.get("bookingId");
    const bookingUserId = search.get("bookingUserId");

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
            <PaymentModal user={authUser} bookingId={bookingId} bookingUserId={bookingUserId} />
        </div>
    )
}