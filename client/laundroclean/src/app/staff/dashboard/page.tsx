"use client";

import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import Overview from "src/components/ui/Modals/CompanyUser/OverviewModal/OverviewModal";
import BookingModal from "src/components/ui/Modals/CompanyUser/BookingModal/BookingModal";
import DeliveryModal from "src/components/ui/Modals/CompanyUser/DeliveryModal/DeliveryModal";
import StaffServicesModal from "src/components/ui/Modals/CompanyUser/Staff/ServicesModal/ServicesModal";
import CalendarModal from "src/components/ui/Modals/CompanyUser/CalendarModal/CalendarModal";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import SettingsUI from "src/components/ui/SettingsUI/settingsUI";
import styles from '../../admin/(without-dashboard-layout)/controlpanel/settings/settings.module.css';
import { useCurrentUser } from "src/hooks/profile/useProfile";
import { mockCompanyStaff } from "src/services/companyUser/mock";
import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";


export default function StaffDashboard() {
    const { activeMenu } = useCompanyUserMenu();

    const { data, isLoading, isError, refetch } = useCurrentUser();
    const user = data?.user || mockCompanyStaff;
    const profile = data?.profile;
    if (isLoading) return <FaSpinner />;
    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        )
    }

    return (
        <div>
            {activeMenu === "overview" && <Overview />}
            {activeMenu === "bookings" && <BookingModal />}
            {activeMenu === "delivery" && <DeliveryModal />}
            {activeMenu === "services" && <StaffServicesModal />}
            {activeMenu === "calendar" && <CalendarModal />}
            {activeMenu === "payment" && <PaymentModal />}
            {
                activeMenu === "settings" &&
                (<div id="settings" style={{ margin: "1em", minHeight: "100vh", display: "flex", border: "2px solid #f1efef", borderRadius: "8px", height: "fit-content" }}>
                    <section className={styles.pageContainer}>
                        <h3>Account Settings</h3>
                        <SettingsUI user={user} profile={profile} />
                    </section>
                </div>)}

        </div>
    )
}