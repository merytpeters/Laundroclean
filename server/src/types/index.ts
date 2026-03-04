import { UserType } from '@prisma/client';

export type SessionPayload = {
  id: string
  type: UserType
  role?: {
    id: number;
    title: string;
    level: number;
    permissions?: string[];
  } | null;
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  meta?: PaginationMeta
}

export type AllowedUserTypes = UserType | UserType[];
