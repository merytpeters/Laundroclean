import React from "react";
import Image from "next/image";
import styles from "./ReasonsFlexbox.module.css"

import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ReasonsFlexboxProps {
    icon: string | StaticImport;
    header: string;
    text: string;
}

export default function ReasonsFlexbox({ icon, header, text }: ReasonsFlexboxProps) {
    return (
        <div className={styles.reasonsbox}>
            <Image
                src={icon}
                alt="icon"
                width={64}
                height={64}
                style={{ objectFit: "contain" }}
            />
            <h3>{header}</h3>
            <p>{text}</p>
        </div>
    )
}