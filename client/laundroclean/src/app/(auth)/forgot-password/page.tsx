"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "../signup/signup.module.css";
import { useForgotPassword } from "src/hooks/auth/useAuth";
import { FiCheckCircle } from "react-icons/fi";

export default function ForgotPassword() {
    const fields = [
        {
            label: "Email",
            inputProps: {
                id: "email",
                name: "email",
                type: "email",
                placeholder: "Enter your email",
                required: true,
            },
        },
    ]

    const forgotPasswordMutation = useForgotPassword();

    const onSubmit: NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]> = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const email = String(data.get("email") ?? "").trim();

        forgotPasswordMutation.mutate({ email })
    }
    return (
        <> 
           {forgotPasswordMutation.isSuccess ? (
            <span className={styles.alertmessage}>
                <FiCheckCircle size={24} />
                <h2>
                    Check our email
                </h2>
                <p>
                    If an account exists for {" "}
                    <strong>{forgotPasswordMutation.variables.email}</strong>
                    We&apos;ve sent a password reset link. Please check your inbox and spam
                </p>
            </span>
           ) : (
            <AuthForm
                title="Forgot Password"
                subtitle="Enter Your Email"
                fields={fields}
                onSubmit={onSubmit}
                actions={
                    <Button type="submit" text={forgotPasswordMutation.status === 'pending' ? "Sending Mail..." :"Send Email"} className={styles.signupbutton} />
                }
            />
          )
        }  
        </>
    )
}
