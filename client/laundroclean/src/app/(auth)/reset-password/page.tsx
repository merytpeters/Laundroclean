"use client";

import { useSearchParams } from "next/navigation";
import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "../signup/signup.module.css"
import { useResetPassword } from "src/hooks/auth/useAuth";
import { validatePassword } from "src/utils/validatePassword";
import { toast } from "sonner";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

export default function ResetPassword() {
    const searchParams = useSearchParams();

    const tokenfromURl = searchParams.get("token");

    const fields = [
        {
            label: "Password",
            inputProps: {
                id: "password",
                type: "password",
                placeholder: "Enter your password",
                required: true,
            },
        },
        {
            label: "Re-enter password",
            inputProps: {
                id: "password",
                type: "password",
                placeholder: "Enter your password",
                required: true,
            },
        },
    ]

    const resetPasswordMutation = useResetPassword();
    if (!tokenfromURl) {
        return <p>Invalid or expired password reset link.</p>
    }
    
    const onSubmit: NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]> = (e) => {
        e.preventDefault();
    
        const data = new FormData(e.currentTarget);
        const password = String(data.get("password") ?? "");
        const token = tokenfromURl;

        const pwdError = validatePassword(password);
            if (pwdError) {
            toast.error(pwdError);
            return;
        }
    
        resetPasswordMutation.mutate({ token, password })
    }

    return (
        <>
            { resetPasswordMutation.isSuccess ?
                (
                    <span className={styles.alertmessage}>
                        <FiCheckCircle size={64}/>

                        <h3>Password Reset Successful</h3>

                        <p>Your password has been updated successfully. You can now sign in with your new password.</p>

                        <Link
                          href="/login"
                        >
                            Back to sign In
                        </Link>
                    </span>
                ): (
                    <AuthForm
                        title="New Credentials"
                        subtitle="Reset Password"
                        fields={fields}
                        onSubmit={onSubmit}
                        actions={
                            <Button type="submit" text={resetPasswordMutation.status === 'pending' ? "Resetting Password..." :"Confirm"} className={styles.signupbutton} />
                        }
                />
            
                )
            }
        </>     
    )
}