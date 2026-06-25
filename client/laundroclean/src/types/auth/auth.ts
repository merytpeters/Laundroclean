import { User } from "../users/user";

export type RegisterPayload = {
  name?: string;
  email: string;
  password: string;
  type: "CLIENT" | "COMPANYUSER";
  role?: number | { title: string; level?: number; permissions?: string[] } | null;
};

export type ForgotPasswordPayload = {
    email: string;
}

export type LoginPayload = {
  email: string;
  password: string;
}

export type ResetPasswordPayload = {
  token: string;
  password: string;
}

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
