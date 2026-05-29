"use client";

import { FiPlus, FiX } from "react-icons/fi";
import { useState } from 'react';
import styles from './clientbookings.module.css';
import drawerStyles from 'src/components/ui/Modals/CompanyUser/BookingModal/BookingModal.module.css';
import BookingForm from 'src/components/ui/Forms/BookingForm';

export default function ClientBookings () {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className={styles.clientbookingcontainer}>
            <button className={styles.addnewbtn} onClick={() => setShowForm(true)}>
                <span>Add new</span>
                    <FiPlus size={30}/>
            </button>
               
            <section aria-label="Client Booking display Section" className={styles.bookingsection}>
                Booking History
            </section>

            {/* sliding drawer for client booking form */}
            <div className={`${drawerStyles.drawer} ${showForm ? drawerStyles.open : ''}`} role="dialog" aria-hidden={!showForm}>
                <div className={drawerStyles.drawerHeader}>
                    <h3>New Booking</h3>
                    <button aria-label="Close" className={drawerStyles.drawerClose} onClick={() => setShowForm(false)}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={drawerStyles.drawerContent}>
                    <BookingForm />
                </div>
            </div>
            {showForm && <div className={drawerStyles.drawerOverlay} onClick={() => setShowForm(false)} />}
        </div>
    )
}