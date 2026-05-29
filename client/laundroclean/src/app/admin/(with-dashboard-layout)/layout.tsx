// import { redirect } from "next/navigation";
import CompanyUserLayout from "src/components/layouts/CompanyUser/CompanyUserLayout";
//import { getCurrentUser } from "src/lib/auth";
// import { CompanyUser } from "src/types/user";
import { mockCompanyAdmin } from "src/lib/company-user/mock";

export default async function AdminLayout({
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
      user={mockCompanyAdmin}
      welcomeMessage={{ name: "Admin Name", message: "Manage operations. Monitor performance" }}
      showMenu={true}
    >
      {children}
    </CompanyUserLayout>
  );
}
