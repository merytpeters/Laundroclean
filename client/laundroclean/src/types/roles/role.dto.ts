export type RoleDto = {
    title: string;
    level?: number;
    permissions: string[];
    id: number;
    createdAt?: string;
    updatedAt?: string;
}