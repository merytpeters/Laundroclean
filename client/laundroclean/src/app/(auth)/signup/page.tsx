"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";

export default function Signup() {
  const fields = [
    {
      label: "Name",
      inputProps: {
        id: "name",
        type: "text",
        placeholder: "Enter your name",
        required: true,
      },
    },
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
        title="Create An Account"
        subtitle="Sign up to get started"
        fields={fields}
        actions={
          <>
            <Button text="Sign Up" type="submit" />
            <span>or</span>
            <Button text="Sign up with Google" onClick={() => alert("Google signup")} />
          </>
        }
      />
    </>
  );
}
