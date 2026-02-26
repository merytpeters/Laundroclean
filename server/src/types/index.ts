import { UserType, CompanyRoleTitle } from '@prisma/client';

export type SessionPayload = {
  id: string
  type: UserType
  role?: CompanyRoleTitle | null
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  total?: number
}

export type AllowedUserTypes = UserType | UserType[];
export type AllowedRoles = CompanyRoleTitle | CompanyRoleTitle[];

export const ROLE_HIERARCHY: Record<CompanyRoleTitle, number> = {
  ADMIN: 3,
  STAFF: 2,
  CASHIER: 1
};

export type RoutePermission = {
  userTypes: UserType[];
  roles?: CompanyRoleTitle[];
};
