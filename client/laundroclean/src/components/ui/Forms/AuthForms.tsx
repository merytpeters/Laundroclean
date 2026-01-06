"use client";

import React from "react";
import styles from "./AuthForm.module.css";

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
                <span>Have an Account Already ? <a href="">Login</a></span>
        </form>
    )
}