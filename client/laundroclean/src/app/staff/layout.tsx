// import { redirect } from "next/navigation";
import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
//import { getCurrentUser } from "src/lib/auth";
// import { CompanyUser } from "src/types/user";
import { mockCompanyStaff } from "src/lib/company-user/mock";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*const user = (await getCurrentUser()) as CompanyUser | null;

  if (!user || user.type !== "COMPANYUSER") {
    redirect("/login");
  }*/ 

  return (
    <CompanyUserLayout 
      user={mockCompanyStaff}
      welcomeMessage={{ title: "Staff Dashboard", message: "Manage your laundromat operations" }}
    >
      {children}
    </CompanyUserLayout>
  );
}
