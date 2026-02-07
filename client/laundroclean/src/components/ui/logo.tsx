import { Jacques_Francois } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

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
      style={{
        background: "linear-gradient(135deg, #0F233A, #163A5F)",
        padding: "8px 24px",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        boxShadow: "0 10px 10px rgba(0,0,0,0.15)",
      }}
    >
    <Link href="/">
      {/* L mark */}
      <div
        className={jacques.className}
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
      >
        L

      {/* Logo image */}
      <Image
        src={logoSrc}
        alt="App logo"
        height={size}
        width={size + 100}
        style={{ display: "block" }}
      />
      
      </div>
      </Link>
    </div>
  );
}

