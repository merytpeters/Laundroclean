"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "./login.module.css"

export default function Login() {
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
    {
      label: "Password",
      inputProps: {
        id: "password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
      },
    },
  ];

  return (
    <>
      <AuthForm
        title="Welcome Back"
        subtitle="Sign in to your account to book services and manage your laundry"
        fields={fields}
        actions={
          <>
            <Button text="Login" type="submit" className={styles.loginbutton}/>
            <span>or</span>
            <Button text="Continue with Google" className={styles.googlebutton} onClick={() => alert("Google signup")} />
          </>
        }
      />
    </>
  );
}