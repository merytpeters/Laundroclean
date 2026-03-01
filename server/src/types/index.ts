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

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  total?: number
}

export type AllowedUserTypes = UserType | UserType[];
