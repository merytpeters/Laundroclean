import { apiRequest } from "./requests";
import { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload } from "src/types/auth/auth";
import { LoginResponseDto, AuthResponseDto } from "src/types/auth/auth.dto";

export const authApi = {
    registerUser: (payload: RegisterPayload) =>
        apiRequest<AuthResponseDto>("/auth/client/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    loginUser: (payload: LoginPayload) =>
        apiRequest<LoginResponseDto>("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    forgotPassword: (payload: ForgotPasswordPayload) =>
        apiRequest<string>("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    
    resetPassword: (payload: ResetPasswordPayload) =>
        apiRequest<string>("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    
    logout: () =>
        apiRequest<string>("auth/logout", {
            method: "POST"
        })
};