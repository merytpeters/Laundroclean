"use client";

import { CompanyUserMenuContext, useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";

import Overview from "src/components/ui/Modals/CompanyUser/OverviewModal/OverviewModal";
import BookingModal from "src/components/ui/Modals/CompanyUser/BookingModal/BookingModal";
import DeliveryModal from "src/components/ui/Modals/CompanyUser/DeliveryModal/DeliveryModal";
import CalendarModal from "src/components/ui/Modals/CompanyUser/CalendarModal/CalendarModal";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import { useAuth } from "src/context/AuthContext";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { useContext } from "react";
import { useGetbookings } from "src/hooks/booking/useBooking";

export default function AdminDashboard() {
    const { activeMenu } = useCompanyUserMenu();
    const companyContext = useContext(CompanyUserMenuContext) as React.ContextType<typeof CompanyUserMenuContext> | undefined;
    const bookingId = companyContext?.bookingInfo?.bookingId;
    const { data } = useGetbookings({
        id: bookingId,
        enabled: Boolean(bookingId)
    });
    const bookingUserId = data?.data && !Array.isArray(data.data)
        ? data.data.profile?.userId
        : undefined

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

    if (!authUser || authUser.type !== "COMPANYUSER" || authUser.uiRole !== "ADMIN") {
        return null
    }


    return (
        <div>
            {activeMenu === "overview" && <Overview />}
            {activeMenu === "bookings" && <BookingModal />}
            {activeMenu === "delivery" && <DeliveryModal />}
            {activeMenu === "calendar" && <CalendarModal />}
            {activeMenu === "payment" && <PaymentModal user={authUser} bookingId={bookingId} bookingUserId={bookingUserId} />}
        </div>
    )
}