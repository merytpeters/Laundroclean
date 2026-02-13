import React from "react";
import styles from "./ActionButton.module.css";

interface ActionButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export default function ActionButton({
  icon,
  text,
  onClick,
  href,
  className = "",
  disabled = false,
}: ActionButtonProps) {
  const content = (
    <>
      {icon}
      <span>{text}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${styles.buttonStyle} ${className} ${disabled ? styles.disabled : ""}`}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.buttonStyle} ${className}`}
    >
      {content}
    </button>
  );
}
