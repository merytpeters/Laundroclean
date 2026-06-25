import { CompanyUser } from "src/types/users/user";
import { Role } from "src/types/role";

export const mockCompanyAdmin: CompanyUser = {
  id: "1",
  email: "admin@company.com",
  firstName: "Admin",
  lastName: "User",
  type: "COMPANYUSER",
  role: Role.ADMIN,
};


export const mockCompanyStaff: CompanyUser = {
  id: "2",
  email: "staff@company.com",
  firstName: "Staff",
  lastName: "User",
  type: "COMPANYUSER",
  role: Role.STAFF,
};

export const mockStaffOptions = [
  { id: mockCompanyAdmin.id, name: `${mockCompanyAdmin.firstName} ${mockCompanyAdmin.lastName}` },
  { id: mockCompanyStaff.id, name: `${mockCompanyStaff.firstName} ${mockCompanyStaff.lastName}` },
];
