"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import Button from "../Button/Button";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <header className={styles.header}>
            <Image
            src="/img/logo.png"
            alt="laundroclean logo"
            width={116}
            height={57}
            className={styles.logo}
            />
            <nav className={styles.nav}>
                <ul>
                    <li><Link href="">Services</Link></li>
                    <li><Link href="/#contact">Contact</Link></li>
                    <li><Link href="">About</Link></li>
                    <li><Link href="/signup">Sign up</Link></li>
                </ul>
            </nav>
            <Button text="Browse Services" className={styles.serviceButton}/>

            <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            >
                ☰
            </button>
            {menuOpen && (
                <nav className={styles.mobileNav}>
                    <ul>
                        <li><Link href="" onClick={() => setMenuOpen(false)}>Services</Link></li>
                        <li><Link href="" onClick={() => setMenuOpen(false)}>Contact</Link></li>
                        <li><Link href="" onClick={() => setMenuOpen(false)}>About</Link></li>
                        <li><Link href="/signup" onClick={() => setMenuOpen(false)}>Sign up</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    )
}