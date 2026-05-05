import React from "react";
import styles from "./auth.module.css"
import BackButton from "src/components/ui/Button/BackButton";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.authlayout}>
      <span className={styles.backbutton}><BackButton /> </span>
      <span className={styles.mainform}> {children} </span>
    </div>
  );
}
