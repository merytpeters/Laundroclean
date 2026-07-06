import { adminApi } from 'src/lib/api/adminApi';
import { authApi } from 'src/lib/api/authApi';
import { mapUser } from 'src/types/users/user.dto';
import { RegisterPayload, LoginPayload, AuthSession, ForgotPasswordPayload, ResetPasswordPayload } from 'src/types/auth/auth';
import { User } from 'src/types/users/user';

export async function registerUserService(payload: RegisterPayload): Promise<{ user: User; message: string } | null> {
    const api =
        payload.type === "CLIENT"
            ? authApi
            : adminApi;

    const res = await api.registerUser(payload);

    if (!res.success) {
        throw new Error(res.message || 'Registration failed');
    }

    if (!res.data) return null;

    const user = mapUser(res.data.user);
    const message = res.message ?? 'Success';

    return {
        user,
        message
    }
}

export async function loginUserService(payload: LoginPayload): Promise<{ user: AuthSession; message: string }| null> {
    const res = await authApi.loginUser(payload);

    if (!res.data) return null;
    const { user: authenticatedUser, accessToken } = res.data;
    const message = res.message ?? 'Success';


    const authSession: AuthSession = {
        user: mapUser(authenticatedUser),
        accessToken,
    };

    return {
        user: authSession,
        message,
    };
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