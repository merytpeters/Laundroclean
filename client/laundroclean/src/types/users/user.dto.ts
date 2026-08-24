import { User } from "./user";
import { mapRole } from "../roles/role";

export type UserDto = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    type: "CLIENT" | "COMPANYUSER";
    roleId?: number;
    role?: {
        id: number;
        title: string;
        level?: number;
        permissions?: string[];
    };
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isActive: boolean;
};

export function mapUser(dto: UserDto): User {
    const base = {
        id: dto.id,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        deletedAt: dto.deletedAt,
        isActive: dto.isActive
    };

    const companyuserrole = {
        role: dto.role
    }

    if (dto.type === "CLIENT") {
        return {
            ...base,
            type: "CLIENT",
        };
    }

    return {
        ...base,
        ...companyuserrole,
        type: "COMPANYUSER",
        uiRole: mapRole(dto.role?.title),
    };
}

export type ProfileDto = {
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

type user = {
    user: UserDto;
}

export type UserProfileDto = user & ProfileDto
