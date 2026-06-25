import { User } from "./user";
import { mapRole } from "../role";

export type UserDto = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    type: "CLIENT" | "COMPANYUSER";
    roleId?: number | null;
    role: {
        title: string;
    } | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    isActive?: boolean;
};

export function mapUser(dto: UserDto): User {
    const base = {
        id: dto.id,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
    };

    if (dto.type === "CLIENT") {
        return {
            ...base,
            type: "CLIENT",
        };
    }

    return {
        ...base,
        type: "COMPANYUSER",
        role: mapRole(dto.role?.title),
    };
}