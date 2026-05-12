"use client";
import StatCard from "src/components/ui/flexboxes/StatCard";
import BookingDisplayCard from "src/components/ui/flexboxes/BookingDisplayCard";
import { stats } from "../OverviewModal/OverviewMockData";
import { roleConfig } from "src/lib/company-user/role-config";
import styles from "./BookingModal.module.css"
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { BookingStatMeta } from "src/components/ui/StatMeta";
import { LocalSearchBar, FilterSearch } from "src/components/ui/SearchBar/SearchBar"
import { FiPlus } from "react-icons/fi";

export default function BookingModal () {
    const { user } = useCompanyUserMenu();
    
    const config = roleConfig[user.role];
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

            <button className={styles.addnewbtn}>
                <span>Add new</span>
                    <FiPlus size={30}/>
            </button>
               
            <section aria-label="Booking display Section" className={styles.tablesection}>
                <BookingDisplayCard />
            </section>
        </div>
    )
}