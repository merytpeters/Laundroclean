"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./AppHeaderMenu.module.css";

export interface MenuItem {
  label: string;
  key: string;
}

interface AppHeaderMenuProps {
  items: MenuItem[];
  activeKey: string;
  onItemClick: (key: string) => void;
}

export default function AppHeaderMenu({
  items,
  activeKey,
  onItemClick,
}: AppHeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  return (
    <nav className={styles.horizontalnav} ref={rootRef}>
      <button
        className={styles.hamburgerButton}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((s) => !s)}
        type="button"
      >
        <span className={styles.hamburgerIcon} />
      </button>

      <ul className={styles.menuList}>
        {items.map((item) => (
          <li
            key={item.key}
            onClick={() => onItemClick(item.key)}
            className={`${styles.menuItem} ${
              activeKey === item.key ? styles.active : ""
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div className={`${styles.mobileMenu} ${open ? styles.open : ""}`}>
        <ul>
          {items.map((item) => (
            <li
              key={item.key}
              onClick={() => {
                onItemClick(item.key);
              }}
              className={`${styles.menuItem} ${
                activeKey === item.key ? styles.active : ""
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
