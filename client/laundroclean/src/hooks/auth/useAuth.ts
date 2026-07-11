import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { registerUserService, loginUserService, forgotPasswordService, resetPasswordService, logoutService } from "src/services/authService/auth.service";
import { useRouter } from "next/navigation";
import { clearAccessToken, setAccessToken } from "src/lib/api/auth-store";
import { useAuth } from "src/context/AuthContext";


export function useRegisterUser() {
    return useMutation({
        mutationFn: registerUserService,

        onError(error) {
            toast.error(error.message);
        }
    });
}

export function useLoginUser() {
    const { setAuthUser } = useAuth();
    const router = useRouter();
    return useMutation({
        mutationFn: loginUserService,
        
        onSuccess(data) {
            setAccessToken(data?.user.accessToken ?? null);
            toast.success(data?.message);
            const user = data?.user.user;
            if (!user) return;
            setAuthUser(user)
            if (user.type === "CLIENT") {
                router.push("/user/dashboard");
            } else if (user.uiRole === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/staff/dashboard");
            }
        },
        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: forgotPasswordService,

        onSuccess(data) {
            toast.success(data.message);
        },
        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useResetPassword() {
    return useMutation({
        mutationFn: resetPasswordService,

        onSuccess(data) {
            toast.success(data.message);
        },
        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useLogout() {
    const { setAuthUser } = useAuth();
    const router = useRouter();
    return useMutation({
        mutationFn: logoutService,

        onSuccess(data) {
            clearAccessToken();
            setAuthUser(null);
            if (data) {
                toast.success(data);
            }
            router.push("/login");
        },

        onError(error) {
            toast.error(error.message);
        }
    })
}