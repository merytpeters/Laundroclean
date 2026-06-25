import { useMutation } from "@tanstack/react-query";
import { registerUserService, loginUserService, forgotPasswordService, resetPasswordService } from "src/services/authService/auth.service";

export function useRegisterUser() {
    return useMutation({
        mutationFn: registerUserService,
    });
}