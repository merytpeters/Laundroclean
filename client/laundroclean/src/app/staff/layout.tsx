"use client";

import { redirect } from "next/navigation";
import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
import { mockCompanyStaff } from "src/services/companyUser/mock";
import { useCurrentUser } from "src/hooks/profile/useProfile";
// import ProtectedRoute from "src/components/ui/ProtectedRoutes";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = useCurrentUser();
  const user = userProfile.data?.user || mockCompanyStaff;

  if (!user || user.type !== "COMPANYUSER") {
    redirect("/login");
  }

  return (
    //<ProtectedRoute>
      <CompanyUserLayout
        user={user}
        welcomeMessage={{ name: user?.firstName || user?.lastName || "Staff Name", message: "Manage your laundromat duties" }}
      >
        {children}
      </CompanyUserLayout>
    //</ProtectedRoute>
  );
}
