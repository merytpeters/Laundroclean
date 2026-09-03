"use client";
import StatCard from "src/components/ui/flexboxes/StatCard";
import BookingDisplayTable from "src/components/ui/flexboxes/BookingDisplayTable";
import { stats } from "../../../../../services/bookingService/bookingMockData";
import { roleConfig } from "src/lib/company-user/role-config";
import styles from "./BookingModal.module.css"
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { BookingStatMeta } from "src/components/ui/StatMeta";
import { LocalSearchBar, FilterSearch } from "src/components/ui/SearchBar/SearchBar"
import { FiX, FiPlus as PlusIcon } from "react-icons/fi";
import { useState } from 'react';
import BookingForm from "src/components/ui/Forms/BookingForm";
import { useServices } from "src/hooks/laundroCleanServices/useServices";
import { useGetUsers } from "src/hooks/companyUser/useUser/useUser";
import { useGetbookings } from "src/hooks/booking/useBooking";
import { transformFieldInArray } from "src/utils/mapData";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
import { mapDeliveryType } from "src/types/booking/bookingStatus";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";

export default function BookingModal() {
    const { user } = useCompanyUserMenu();
    const [showForm, setShowForm] = useState(false);
    const { data: servicesData } = useServices({
        params: {
            includeDeleted: 'false',
        }
    })

    const queryParams = {
        status: "active",
    } as const;

    const { data: staffData } = useGetUsers({ type: "COMPANYUSER" }, queryParams)

    const staffToAssign = staffData?.data

    const services = servicesData?.data;

    const { data, isLoading: bookingLoadingState } = useGetbookings({
        params: {
            includeProfile: true,
        }
    });

    const bookingData = Array.isArray(data?.data)
        ? data.data
        : [];

    const mappedCurrency = transformFieldInArray(
        bookingData,
        "currency",
        mapCurrencySymbol
    );

    const mappedBookingData = transformFieldInArray(
        mappedCurrency,
        "deliveryType",
        mapDeliveryType
    );

    // What staff can SEE in the table
    const visibleBookingData =
        user.uiRole === "ADMIN"
            ? mappedBookingData
            : mappedBookingData.filter((booking) => {
                const isAssignedToMe =
                    booking.assignedToId === user.id;

                const isPending =
                    booking.status === "PENDING";

                return isAssignedToMe || isPending;
            });

    const statsBookingData =
        user.uiRole === "ADMIN"
            ? mappedBookingData
            : mappedBookingData.filter(
                (booking) => booking.assignedToId === user.id
            );

    const isToday = (date: string | Date | null | undefined) => {
        if (!date) return false;

        const bookingDate = new Date(date);
        const today = new Date();

        return (
            bookingDate.getDate() === today.getDate() &&
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear()
        );
    };

    const stats = {
        dailyBookings: statsBookingData.filter(
            (booking) => isToday(booking.transactions?.[0]?.paidAt)
        ).length,

        pendingBookings: statsBookingData.filter(
            (booking) => booking.status === "PENDING"
        ).length,

        confirmedBookings: statsBookingData.filter(
            (booking) => booking.status === "CONFIRMED"
        ).length, // payment has been made

        inprogressBookings: statsBookingData.filter(
            (booking) => booking.status === "IN_PROGRESS"
        ).length,

        dailyFulfilledOrders: statsBookingData.filter(
            (booking) =>
                booking.status === "COMPLETED" &&
                isToday(booking.transactions?.[0]?.paidAt)
        ).length,
    };

    if (bookingLoadingState) return <LoadingState />;

    if (!user.uiRole) return null;
    const config = roleConfig[user.uiRole];

    return (
        <div className={styles.bookingmodalcontainer}>
            <section className={styles.bookingrowgrid}>
                <section aria-label="Booking Stat Card" className={styles.statcardbox}>
                    {config.BookingStatCards?.map((card) => {
                        const meta = BookingStatMeta[card.key as keyof typeof BookingStatMeta];

                        return (
                            <StatCard
                                key={card.key}
                                header={card.title}
                                text={meta?.text}
                                icon={meta?.icon}
                                iconColor={meta?.iconColor}
                                unit={meta?.unit}
                                value={stats[card.key as keyof typeof stats]}
                                className={styles.bookingstatcard}
                            />
                        );
                    })}
                </section>

                <section aria-label="Search section" className={styles.searchsection}>
                    <span className={styles.searchicons}>
                        <LocalSearchBar placeHolder="Search bookings..." />
                        <FilterSearch placeholder="Filter by Status" />
                    </span>

                </section>
            </section>



            <section aria-label="Booking display Section" className={styles.tablesection}>
                <button className={styles.addnewbtn} onClick={() => setShowForm(true)}>
                    <span>Add new</span>
                    <PlusIcon size={30} />
                </button>
                <BookingDisplayTable mappedBookingData={visibleBookingData} />
            </section>

            {/* sliding drawer for new booking */}
            <div className={`${styles.drawer} ${showForm ? styles.open : ''}`} role="dialog" aria-hidden={!showForm}>
                <div className={styles.drawerHeader}>
                    <h4>New Booking</h4>
                    <button aria-label="Close" className={styles.drawerClose} onClick={() => setShowForm(false)}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={styles.drawerContent}>
                    <BookingForm
                        showStaffAssignedSlot={user.uiRole === 'ADMIN'}
                        staffOptions={user.uiRole === 'ADMIN' ? staffToAssign : undefined}
                        services={services}
                    />
                </div>
            </div>
            {showForm && <div className={styles.drawerOverlay} onClick={() => setShowForm(false)} />}
        </div>
    )
}