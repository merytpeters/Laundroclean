import { UserType, CompanyRoleTitle } from '@prisma/client';

export type SessionPayload = {
    id: string
    type: UserType
    companyRoleTitle?: CompanyRoleTitle 
}

export interface APIResponse<T = any> {
    success: boolean,
    data?: T,
    message?: string,
    total?: number
}
