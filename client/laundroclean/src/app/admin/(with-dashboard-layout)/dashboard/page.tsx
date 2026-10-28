"use client";

import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import Overview from "src/components/ui/Modals/CompanyUser/OverviewModal/OverviewModal";
import BookingModal from "src/components/ui/Modals/CompanyUser/BookingModal/BookingModal";
import DeliveryModal from "src/components/ui/Modals/CompanyUser/DeliveryModal/DeliveryModal";
import CalendarModal from "src/components/ui/Modals/CompanyUser/CalendarModal/CalendarModal";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import { useAuth } from "src/context/AuthContext";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { useContext, useEffect } from "react";
import { useGetbookings } from "src/hooks/booking/useBooking";
import { useSearchParams } from "next/navigation";


export default function AdminDashboard() {
    const { activeMenu, setActiveMenu, setBookingInfo, bookingInfo } = useCompanyUserMenu();
    // const companyContext = useContext(CompanyUserMenuContext) as React.ContextType<typeof CompanyUserMenuContext> | undefined;

    useEffect(() => {
        const hash = window.location.hash;
        const [section, params] = hash.slice(1).split("?");

        if (section !== "payment") return;

        const searchParams = new URLSearchParams(params);
        const bookingId = searchParams.get("bookingId");
        const bookingUserId = searchParams.get("bookingUserId");

        if (!bookingId) return;

        setBookingInfo?.({
            bookingId,
            bookingUserId: bookingUserId ?? "",
        })

        setActiveMenu("payment");
        window.history.replaceState(
            window.history.state,
            "",
            "/admin/dashboard#payment"
        );
    }, [setActiveMenu, setBookingInfo]);

    const bookingId = bookingInfo?.bookingId

    const { data } = useGetbookings({
        id: bookingId ?? "",
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
    // console.log("Currency:", currency)
    // console.log("amount:", amount)

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

    // console.log("BookingId:", bookingId);


    return (
        <div>
            {activeMenu === "overview" && <Overview />}
            {activeMenu === "bookings" && <BookingModal />}
            {activeMenu === "delivery" && <DeliveryModal />}
            {activeMenu === "calendar" && <CalendarModal id="" title="" start="" end="" allDay />}
            {activeMenu === "payment" && <PaymentModal user={authUser} bookingId={bookingId} bookingUserId={bookingUserId} amount={amount} currency={currency} />}
        </div>
    )
}