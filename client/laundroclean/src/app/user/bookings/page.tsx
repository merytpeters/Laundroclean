"use client";

import { FiPlus, FiX } from "react-icons/fi";
import { useState } from 'react';
import styles from './clientbookings.module.css';
import drawerStyles from 'src/components/ui/Modals/CompanyUser/BookingModal/BookingModal.module.css';
import BookingForm from 'src/components/ui/Forms/BookingForm';
import ClientBookingHistory, { ClientAllOnGoingBookings } from "src/components/ui/ClientUI/ClientBookingHistory";
import { useAuth } from "src/context/AuthContext";
import { useServices } from "src/hooks/laundroCleanServices/useServices";
import { useGetClientbookings } from "src/hooks/booking/useBooking";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "src/hooks/debounceHook";
import { transformFieldInArray } from "src/utils/mapData";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
import { mapBookingStatus, mapDeliveryType } from "src/types/booking/bookingStatus";
import Pagination from "src/components/ui/Pagination/Pagination";

export default function ClientBookings() {
    const [showForm, setShowForm] = useState(false);
    const { authUser, authProfile } = useAuth();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 6; // ensure pagination and slice are the same value
    const search = searchParams.get('search') || '';
    const debouncedSearch = useDebounce(search, 500);
    const queryParams = {
        page,
        limit,
        debouncedSearch
    }
    const { data } = useServices({
        params: {
            includeDeleted: 'false'
        }
    })

    const services = data?.data;
    const { data: bookingsData } = useGetClientbookings({
        params: {
            ...queryParams,
            includeProfile: false
        }
    })

    const bookingData = Array.isArray(bookingsData?.data)
        ? bookingsData.data
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

    const bookingMetaData = bookingsData?.meta;

    const pastBookingData = mappedBookingData.filter((booking) => {
        return (
            booking.status === "COMPLETED" ||
            booking.status === "DELIVERED"
        );
    });

    const allOtherBookingData = mappedBookingData.filter((booking) => {
        return (
            booking.status !== "COMPLETED" &&
            booking.status !== "DELIVERED"
        );
    });

    const mappedVisibleOngoingBookingDataStatus = allOtherBookingData.map((item) => ({
        ...item,
        mappedStatus: mapBookingStatus(item.status, { deliveryType: item?.deliveryType }),
    }))

    if (!authUser) {
        throw new Error("User not authenticated")
    }

    if (authUser.type !== "CLIENT") {
        return null
    }

    const user = {
        authUser,
        authProfile
    }

    return (
        <div className={styles.clientbookingcontainer}>
            <button className={styles.addnewbtn} onClick={() => setShowForm(true)}>
                <span>Add new</span>
                <FiPlus size={30} />
            </button>
            <section className={styles.bookingsection}>
                <section className={styles.allongoingbookings}>
                    <ClientAllOnGoingBookings mappedBookingData={mappedVisibleOngoingBookingDataStatus} />
                </section>

                <section aria-label="Client Booking display Section" className={styles.pastbookingsection}>
                    <ClientBookingHistory mappedBookingData={pastBookingData} />
                </section>
                <Pagination
                    totalPages={bookingMetaData?.totalPages ?? 1}
                />

            </section>


            {/* sliding drawer for client booking form */}
            <div className={`${drawerStyles.drawer} ${showForm ? drawerStyles.open : ''}`} role="dialog" aria-hidden={!showForm}>
                <div className={drawerStyles.drawerHeader}>
                    <h4>New Booking</h4>
                    <button aria-label="Close" className={drawerStyles.drawerClose} onClick={() => setShowForm(false)}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={drawerStyles.drawerContent}>
                    <BookingForm
                        user={user}
                        services={services}
                    />
                </div>
            </div>
            {showForm && <div className={drawerStyles.drawerOverlay} onClick={() => setShowForm(false)} />}
        </div>
    )
}