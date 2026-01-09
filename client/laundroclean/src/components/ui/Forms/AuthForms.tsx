"use client";

import React from "react";
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

    return (
        <form className={styles.form}>
                <legend>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </legend>
                {fields.map((field, index) => (
                    <p key={index}>
                        <label htmlFor={field.inputProps.id}>
                            {field.label}
                        </label>
                        <input {...field.inputProps} />
                    </p>
                ))}
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