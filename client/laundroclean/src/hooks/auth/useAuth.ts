import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { registerUserService, loginUserService, forgotPasswordService, resetPasswordService, logoutService } from "src/services/authService/auth.service";
import { useRouter } from "next/navigation";
import { setAccessToken } from "src/lib/api/auth-store";


export function useRegisterUser() {
    return useMutation({
        mutationFn: registerUserService,

        onError(error) {
            toast.error(error.message);
        }
    });
}

export function useLoginUser() {
    const router = useRouter();
    return useMutation({
        mutationFn: loginUserService,
        
        onSuccess(data) {
            setAccessToken(data?.user.accessToken ?? null);
            toast.success(data?.message);
            const user = data?.user.user;
            if (!user) return;

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
    return useMutation({
        mutationFn: logoutService
    })
}