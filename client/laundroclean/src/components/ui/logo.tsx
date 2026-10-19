import { Jacques_Francois } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import styles from "./logo.module.css";

const jacques = Jacques_Francois({
  subsets: ["latin"],
  weight: "400",
});

interface LogoProps {
  size?: number;
  logoSrc?: string;
}

export default function Logo({ size = 24, logoSrc = "/img/applogo.png" }: LogoProps) {
  return (
    <div
      className={styles.logoContainer}
    >
    <Link href="/">
      {/* L mark */}
      <div
        style={{
          width: size + 4,
          height: size + 4,
          borderRadius: 6,
          color: "#469BD3",
          fontWeight: 400,
          fontSize: size * 0.9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
        className={`${jacques.className} ${styles.logoContent}`}
      >
        L

      {/* Logo image */}
      <Image
        src={logoSrc}
        alt="App logo"
        height={size}
        width={size + 100}
        style={{ display: "block" }}
        className={styles.logoimg}
      />
      
      </div>
      </Link>
    </div>
  );
}

