"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "../signup/signup.module.css"

export default function ResetPassword() {
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
    return (
        <>
            <AuthForm
                title="Reset Password"
                fields={fields}
                actions={
                    <Button type="submit" text="Confirm" className={styles.signupbutton} />
                }
            />
        </>
    )
}