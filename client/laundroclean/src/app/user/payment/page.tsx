"use client";

import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import { useAuth } from "src/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { useGetClientbookings } from "src/hooks/booking/useBooking";


export default function ClientPayment() {
    const { authUser, authProfile, isLoading, isError, refetch } = useAuth();
    const search = useSearchParams();
    const bookingId = search.get("bookingId") || "";
    const { data } = useGetClientbookings({
        id: bookingId,
        enabled: Boolean(bookingId)
    });
    const bookingUserId = data?.data && !Array.isArray(data.data)
        ? data.data.profile?.userId
        : undefined

    const amount = data?.data && !Array.isArray(data.data)
        ? data.data.finalAmount
        : undefined
    
    const currency = data?.data && !Array.isArray(data.data)
        ? data.data.currency
        : undefined
    
    // console.log(data?.data)

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
        <div style={{ color: "black", flexShrink: 1, width: "100%", background: "#fffff"}}>
            <PaymentModal user={authUser} bookingId={bookingId} bookingUserId={bookingUserId} amount={amount} currency={currency}/>
        </div>
    )
}