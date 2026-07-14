"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "./signup.module.css"
import React, { useState } from "react";
import { useRegisterUser } from "src/hooks/auth/useAuth";
import { validatePassword } from "src/utils/validatePassword";

export default function Signup() {
  const registerMutation = useRegisterUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  })

  const getFields = (handleNameSplit: (value: string) => [string, string]) => [
    {
      label: "Name",
      inputProps: {
        id: "name",
        name: "name",
        type: "text",
        placeholder: "Enter your first and last names",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleNameSplit(e.target.value),
        required: true,
      },
    },
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
    {
      label: "Password",
      inputProps: {
        id: "password",
        name: "password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
      },
    },
    {
      label: "Confirm Password",
      inputProps: {
        name: "confirm password",
        type: "password",
        placeholder: "Re-enter your password",
        required: true,
      },
    },
  ];

  const handleNameSplit = (val: string): [string, string] => {
    const name = val.trim();
    const index = name.indexOf(' ');

    if (index === -1) {
      const firstName = name;
      const lastName = ''
      setFormData({ ...formData, firstName, lastName});
      return [firstName, lastName]
    } else {
      const firstName = name.substring(0, index)
      const lastName = name.substring(index + 1)
      setFormData({
        ...formData,
        firstName,
        lastName,
      })
      return [firstName, lastName]
    }
  }

  const onSubmit: NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]> = (e) => {
    e.preventDefault();

    // console.log('[Signup] onSubmit fired');

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const typedName = String(data.get("name") ?? "").trim();

    const name = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || typedName;
    

    const pwdError = validatePassword(password);
    if (pwdError) {
      toast.error(pwdError);
      return;
    }
    // console.log('[Signup] payload', { name, email, password });

    registerMutation.mutate({
      name,
      email,
      password,
      type: "CLIENT",
    }, {
      onSuccess(data) {
            toast.success(data?.message);
            router.push("/login")
        },
    });
  }

  return (
    <>
      <AuthForm
        title="Create An Account"
        subtitle="Sign up to get started"
        fields={getFields(handleNameSplit)}
        onSubmit={onSubmit}
        actions={
          <>
            <Button text={registerMutation.status === 'pending' ? "Signing Up..." : "Sign Up"} type="submit" className={styles.signupbutton}/>
            <span>or</span>
            <Button type="button" text="Sign up with Google" className={styles.googlebutton} onClick={() => alert("Google signup")} />
          </>
        }
      />
    </>
  );
}
