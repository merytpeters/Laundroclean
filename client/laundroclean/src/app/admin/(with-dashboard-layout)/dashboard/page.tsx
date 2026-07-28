"use client";

import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";

import Overview from "src/components/ui/Modals/CompanyUser/OverviewModal/OverviewModal";
import BookingModal from "src/components/ui/Modals/CompanyUser/BookingModal/BookingModal";
import DeliveryModal from "src/components/ui/Modals/CompanyUser/DeliveryModal/DeliveryModal";
import CalendarModal from "src/components/ui/Modals/CompanyUser/CalendarModal/CalendarModal";
import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal";
import { mockCompanyAdmin } from "src/services/companyUser/mock";

export default function AdminDashboard () {
    const { activeMenu } = useCompanyUserMenu();

    return (
        <div>
          {activeMenu === "overview" && <Overview />}
          {activeMenu === "bookings" && <BookingModal />}
          {activeMenu === "delivery" && <DeliveryModal />}
          {activeMenu === "calendar" && <CalendarModal />}
          {activeMenu === "payment" && <PaymentModal usertype={mockCompanyAdmin}/>}
        </div>
    )
}