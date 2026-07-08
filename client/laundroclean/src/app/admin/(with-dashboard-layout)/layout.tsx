"use client";

import { redirect } from "next/navigation";
import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
import { useCurrentUser } from "src/hooks/profile/useProfile";
import { mockCompanyAdmin } from "src/services/companyUser/mock";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = useCurrentUser();
  console.log(userProfile);
  const user = userProfile.data?.user || mockCompanyAdmin;

  if (!user || user.type !== "COMPANYUSER") {
    redirect("/login");
  }

  return (
    <CompanyUserLayout 
      user={user}
      welcomeMessage={{ name: user?.firstName || user?.lastName || "Admin", message: "Manage operations. Monitor performance" }}
      showMenu={true}
    >
      {children}
    </CompanyUserLayout>
  );
}
