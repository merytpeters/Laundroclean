// import { redirect } from "next/navigation";
import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
//import { getCurrentUser } from "src/lib/auth";
// import { CompanyUser } from "src/types/user";
import { mockCompanyStaff } from "src/services/companyUser/mock";

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
      welcomeMessage={{ name: "Staff Name", message: "Manage your laundromat duties" }}
    >
      {children}
    </CompanyUserLayout>
  );
}
