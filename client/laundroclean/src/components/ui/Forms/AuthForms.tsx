"use client";

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./AuthForm.module.css";
import { usePathname } from "next/navigation";

export type SelectOption = {
    label: string;
    value: string;
}

interface FieldConfig {
    label: string;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    options?: SelectOption[];
}

export interface FormProps {
    title?: string;
    subtitle?: string;
    fields: FieldConfig[];
    actions: React.ReactNode;
    onSubmit?: React.ComponentPropsWithoutRef<"form">["onSubmit"];
    className?: string;
}


export default function AuthForm({ title, subtitle, fields, actions, onSubmit, className }: FormProps) {
    const pathname = usePathname();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className={className ?? styles.form} onSubmit={onSubmit}>
            <legend>
                <h4>{title}</h4>
                <p>{subtitle}</p>
            </legend>

            {fields.map((field, index) => {
                const isPassword = field.inputProps.type === "password";
                const isSelect = field.inputProps.type === "select";

                return (
                    <div key={index} className={styles.inputWrapper}>
                        <label htmlFor={field.inputProps.id}>{field.label}</label>

                        <div className={styles.passwordWrapper}>
                            {isSelect ? (
                                <select id={field.inputProps.id} name={field.inputProps.name} defaultValue="">
                                    {field.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                ) : (
                                    <input 
                                        {...field.inputProps}
                                        type={isPassword ? (showPassword ? "text" : "password") : field.inputProps.type}
                                    />
                                )
                            }

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
                    <span><a href ="/forgot-password">Forgot Password?</a></span>
                    <span>Don&apos;t have and account yet ? &nbsp; <a href="/signup"><b>Sign up</b></a></span>
                </>
            )}
        </form>
    )
}