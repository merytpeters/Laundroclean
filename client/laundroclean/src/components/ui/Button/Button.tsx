"use client";

import clsx from "clsx";
import styles from "./Button.module.css"

type ButtonProps = {
  text: string;
  className?: string;
  onClick?: () => void;
  href?: string;
  tel?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  disabled?: boolean;
};

export default function Button({
  text,
  className,
  onClick,
  tel,
  href,
  type = "button",
  icon,
  disabled = false,
}: ButtonProps) {
  const buttonClasses = clsx(styles.button, className);

  const link =
    tel?.startsWith("tel:") ? tel :
    tel ? `tel:${tel}` :
    href?.startsWith("wa.me") ? `https://${href}` :
    href || undefined;


  if (link) {
    return (
      <a
        href={link}
        className={buttonClasses}
        target={link.startsWith("https") ? "_blank" : undefined}
        rel={link.startsWith("https") ? "noopener noreferrer" : undefined}
      >
        {text}
      </a>
    );
  }

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
      { icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
}
