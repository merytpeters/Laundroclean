"use client";

import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";

import Overview from "src/components/ui/Modals/CompanyUser/OverviewModal/OverviewModal"

export default function AdminDashboard () {
    const { activeMenu } = useCompanyUserMenu();

    return (
        <div>
          {activeMenu === "overview" && <Overview />}
        </div>
    )
}