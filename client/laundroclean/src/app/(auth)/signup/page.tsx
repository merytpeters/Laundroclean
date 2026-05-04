"use client";

import AuthForm from "src/components/ui/Forms/AuthForms";
import Button from "src/components/ui/Button/Button";
import styles from "./signup.module.css"
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  })

  const getFields = (handleNameSplit: (arg0: any) => any) => [
    {
      label: "Name",
      inputProps: {
        id: "name",
        type: "text",
        placeholder: "Enter your first and last names",
        onChange: (e: { target: { value: any; }; }) => handleNameSplit(e.target.value),
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

  const handleNameSplit = (val: string) => {
    const name = val.trim();
    const index = name.indexOf(' ');

    if (index === -1) {
      setFormData({ ...formData, firstName: name, lastName: ''})
    } else {
      setFormData({
        ...formData,
        firstName: name.substring(0, index),
        lastName: name.substring(index + 1),
      })
    }
  }

  return (
    <>
      <AuthForm
        title="Create An Account"
        subtitle="Sign up to get started"
        fields={getFields(handleNameSplit)}
        actions={
          <>
            <Button text="Sign Up" type="submit" className={styles.signupbutton}/>
            <span>or</span>
            <Button text="Sign up with Google" className={styles.googlebutton} onClick={() => alert("Google signup")} />
          </>
        }
      />
    </>
  );
}
