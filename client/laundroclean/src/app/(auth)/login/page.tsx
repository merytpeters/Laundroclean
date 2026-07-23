"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "./login.module.css";
import { useLoginUser } from "src/hooks/auth/useAuth";

export default function Login() {
  const loginMutation = useLoginUser();

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
  ];

  const onSubmit: NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]> = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <>
      <AuthForm
        title="Welcome Back"
        subtitle="Sign in to your account to book services and manage your laundry"
        fields={fields}
        onSubmit={onSubmit}
        actions={
          <>
            <Button text={loginMutation.isPending ? "Signing In..." : "Log In"} type="submit" className={styles.loginbutton}/>
            <span>or</span>
            <Button text="Continue with Google" className={styles.googlebutton} onClick={() => alert("Google signup")} />
          </>
        }
      />
    </>
  );
}