"use client";

import { FaSpinner } from "react-icons/fa";
import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { useAuth } from "src/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, isLoading, refetch, isError } = useAuth();

  if (isLoading) {
    return <FaSpinner />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load your profile."
        onRetry={refetch}
      />
    );
  }

  if (!authUser || authUser.type !== "COMPANYUSER" || authUser.uiRole !== "ADMIN") {
    return null
  }

  return (
    <CompanyUserLayout
      user={authUser}
      welcomeMessage={{ name: authUser?.firstName || authUser?.lastName || "Admin", message: "Manage operations. Monitor performance" }}
      showMenu={true}
    >
      {children}
    </CompanyUserLayout>
  );
}
