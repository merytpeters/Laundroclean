import { apiRequest } from "./requests";
import { RegisterPayload } from "src/types/auth/auth";
import { AuthResponseDto } from "src/types/auth/auth.dto";

export const adminApi = {
    registerUser: (payload: RegisterPayload) =>
        apiRequest<AuthResponseDto>("/admin/company-user/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
};