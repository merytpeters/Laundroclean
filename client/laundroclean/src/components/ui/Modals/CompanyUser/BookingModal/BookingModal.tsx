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

export default function BookingModal () {
    const { user } = useCompanyUserMenu();
    const [showForm, setShowForm] = useState(false);
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
                        <FilterSearch placeholder="Filter by Status"/>
                    </span>
            
                </section>
            </section>

            
               
            <section aria-label="Booking display Section" className={styles.tablesection}>
                <button className={styles.addnewbtn} onClick={() => setShowForm(true)}>
                    <span>Add new</span>
                        <PlusIcon size={30}/>
                </button>
                <BookingDisplayTable />
            </section>

            {/* sliding drawer for new booking */}
            <div className={`${styles.drawer} ${showForm ? styles.open : ''}`} role="dialog" aria-hidden={!showForm}>
                <div className={styles.drawerHeader}>
                    <h3>New Booking</h3>
                    <button aria-label="Close" className={styles.drawerClose} onClick={() => setShowForm(false)}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={styles.drawerContent}>
                    <BookingForm
                        user={user}
                        showStaffAssignedSlot={user.uiRole === 'ADMIN'}
                        staffOptions={user.uiRole === 'ADMIN' ? [
                            { id: 'staff-1', name: 'Alice' },
                            { id: 'staff-2', name: 'Bob' },
                        ] : undefined}
                    />
                </div>
            </div>
            {showForm && <div className={styles.drawerOverlay} onClick={() => setShowForm(false)} />}
        </div>
    )
}