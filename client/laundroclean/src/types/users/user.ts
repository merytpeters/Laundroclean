import { Role } from "../roles/role";

export interface BaseUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isActive?: boolean;
}

export interface Client extends BaseUser {
    type: "CLIENT";
}

export interface CompanyUser extends BaseUser {
    type: "COMPANYUSER";
    uiRole: Role // this represents ui role for component display
    role?: {
        title: string;
        level?: number;
        permissions?: string[];
    };
    roleId?: number;
}

export type User = Client | CompanyUser;

export type ProfileResponse = {
    id: string;
    phoneNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    paymentMethodToken?: string;
    isTemp: boolean;
    avatarUrl?: string;
    avatarPublicId?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export type UserProfileResponse = {
    user: User;
    profile: ProfileResponse;
}

export type UserPayload = {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: number | { title: string; level?: number; permissions?: string[] } | null;
}

export type ProfilePayload = {
    firstName?: string,
    lastName?: string,
    phoneNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    paymentMethodToken?: string;
    isTemp?: boolean;
}

export type UserProfilePayload = UserPayload & ProfilePayload

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
}

export type UpdatedUserResponse = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isActive?: boolean;
    type: "COMPANYUSER" | "CLIENT";
    role?: {
        title: string;
    };
    roleId?: number;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    status?: "active" | "inactive";
    type?: "client" | "company";
    search?: string;
}

export type UpdateUserStatusPayload = {
    isActive: boolean;
}