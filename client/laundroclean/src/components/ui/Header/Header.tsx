import Image from "next/image";
import styles from "./Header.module.css";
import Button from "../Button/Button";

export default function Header() {
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
                    <li><a href="">Services</a></li>
                    <li><a href="">Contact</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">Sign in</a></li>
                </ul>
            </nav>
            <Button text="Browse Services" className={styles.serviceButton}/>
        </header>

    )
}