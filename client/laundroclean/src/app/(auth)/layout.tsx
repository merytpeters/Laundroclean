import React from "react";
import styles from "./auth.module.css"

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.authlayout}>
      {children}
    </div>
  );
}
