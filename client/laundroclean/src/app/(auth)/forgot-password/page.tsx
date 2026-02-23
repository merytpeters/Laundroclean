"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "../signup/signup.module.css"

export default function ForgotPassword() {
    const fields = [
        {
            label: "Email",
            inputProps: {
                id: "email",
                type: "email",
                placeholder: "Enter your email",
                required: true,
            },
        },
    ]
    return (
        <>
            <AuthForm
                title="Forgot Password"
                fields={fields}
                actions={
                    <Button type="submit" text="Send Email" className={styles.signupbutton} />
                }
            />
        </>
    )
}
