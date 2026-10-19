"use client";

import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
import ProtectedRoute from "src/components/ui/ProtectedRoutes";
import { useAuth } from "src/context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";

export default function StaffLayout({
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

  if (!authUser || authUser.type !== "COMPANYUSER") {
    return null;
  }

  return (
    <ProtectedRoute>
      <CompanyUserLayout
        user={authUser}
        welcomeMessage={{ name: authUser?.firstName || authUser?.lastName || "Staff Name", message: "Manage your laundromat duties" }}
      >
        {children}
      </CompanyUserLayout>
    </ProtectedRoute>
  );
}
