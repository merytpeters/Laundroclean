"use client";

import { FiPlus, FiX } from "react-icons/fi";
import { useState } from 'react';
import styles from './clientbookings.module.css';
import drawerStyles from 'src/components/ui/Modals/CompanyUser/BookingModal/BookingModal.module.css';
import BookingForm from 'src/components/ui/Forms/BookingForm';
import ClientBookingHistory from "src/components/ui/ClientUI/ClientBookingHistory";
import { useAuth } from "src/context/AuthContext";
import { useServices } from "src/hooks/laundroCleanServices/useServices";

export default function ClientBookings() {
    const [showForm, setShowForm] = useState(false);
    const { authUser, authProfile } = useAuth();
    const { data } = useServices({
        params: {
            includeDeleted: 'false'
        }
    })

    const services = data?.data;

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

            <section aria-label="Client Booking display Section" className={styles.pastbookingsection}>
                <ClientBookingHistory />
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