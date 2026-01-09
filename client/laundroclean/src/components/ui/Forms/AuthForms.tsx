"use client";

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./AuthForm.module.css";
import { usePathname } from "next/navigation";

interface FieldConfig {
    label: string;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

interface FormProps {
    title?: string;
    subtitle?: string;
    fields: FieldConfig[];
    actions: React.ReactNode;
}


export default function AuthForm({ title, subtitle, fields, actions }: FormProps) {
    const pathname = usePathname();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className={styles.form}>
            <legend>
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </legend>

            {fields.map((field, index) => {
                const isPassword = field.inputProps.type === "password";

                return (
                    <div key={index} className={styles.inputWrapper}>
                        <label htmlFor={field.inputProps.id}>{field.label}</label>

                        <div className={styles.passwordWrapper}>
                            <input
                                {...field.inputProps}
                                type={isPassword ? (showPassword ? "text" : "password") : field.inputProps.type}
                            />

                            {isPassword && (
                                <button
                                    type="button"
                                    className={styles.showPasswordButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            <div className={styles.formactions}>
                {actions}
            </div>
            {pathname === "/signup" && <span>Have an Account Already ? &nbsp;<a href="/login"><b>Login</b></a></span>}
            {pathname === "/login" && (
                <>
                    <span>Forgot Password ?</span>
                    <span>Don&apos;t have and account yet ? &nbsp; <a href="/signup"><b>Sign up</b></a></span>
                </>
            )}
        </form>
    )
}