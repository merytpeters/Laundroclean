import { Role } from "./role";

export interface BaseUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface Client extends BaseUser {
    type: "CLIENT";
}

export interface CompanyUser extends BaseUser {
    type: "COMPANYUSER";
    role: Role;
}

export type User = Client | CompanyUser;
