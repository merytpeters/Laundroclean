import { adminApi } from 'src/lib/api/adminApi';
import { authApi } from 'src/lib/api/authApi';
import { mapUser } from 'src/types/users/user.dto';
import { RegisterPayload, LoginPayload, AuthSession, ForgotPasswordPayload, ResetPasswordPayload } from 'src/types/auth/auth';
import { User } from 'src/types/users/user';

export async function registerUserService(payload: RegisterPayload): Promise< User|null> {
    const api =
        payload.type === "CLIENT"
            ? authApi
            : adminApi;

    const res = await api.registerUser(payload);

    if (!res.data) return null;

    return mapUser(res.data.user);
}

export async function loginUserService(payload: LoginPayload): Promise<AuthSession| null> {
    const res = await authApi.loginUser(payload);

    if (!res.data) return null;
    const {authenticatedUser, ...session} = res.data

    return {
        user: mapUser(res.data.authenticatedUser),
        ...session
    }
}

export async function forgotPasswordService(payload: ForgotPasswordPayload): Promise<string> {
    const res = await authApi.forgotPassword(payload);

    if (!res.success) {
        throw new Error(res.message || "Failed to send reset email");
    }

    return res.message ?? "Success";
}

export async function resetPasswordService(payload: ResetPasswordPayload): Promise<string> {
    const res = await authApi.resetPassword(payload);

    if (!res.success) {
        throw new Error(res.message || "Password reset failed");
    }

    return res.message ?? "Success";
}