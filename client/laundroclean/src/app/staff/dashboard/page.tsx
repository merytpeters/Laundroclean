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
import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import CompanyUserPromotionsUI from "src/components/ui/Modals/CompanyUser/Promotions/Promotions";
import { useAuth } from "src/context/AuthContext";


export default function StaffDashboard() {
    const { activeMenu } = useCompanyUserMenu();

    const { authUser, authProfile, isLoading, isError, refetch } = useAuth();
    
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
        <div>
            {activeMenu === "overview" && <Overview />}
            {activeMenu === "bookings" && <BookingModal />}
            {activeMenu === "delivery" && <DeliveryModal />}
            {activeMenu === "services" && <StaffServicesModal />}
            {activeMenu === "calendar" && <CalendarModal />}
            {activeMenu === "payment" && <PaymentModal user={authUser} />}
            {activeMenu === "promotions" && <CompanyUserPromotionsUI />}
            {
                activeMenu === "settings" &&
                (<div id="settings" style={{ margin: "1em", minHeight: "100vh", display: "flex", borderRadius: "8px", height: "fit-content" }}>
                    <section className={styles.pageContainer}>
                        <h3>Account Settings</h3>
                        <SettingsUI user={authUser} profile={authProfile} />
                    </section>
                </div>)}

        </div>
    )
}