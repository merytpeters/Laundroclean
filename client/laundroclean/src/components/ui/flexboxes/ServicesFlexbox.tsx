import Image from "next/image";
import React from "react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Button from "../Button/Button";
import styles from "./ServicesFlexbox.module.css"

interface ServicesProps {
    icon: string | StaticImport;
    header: string;
    paragraph: string;
    orderedlist: string[];
}

export default function Services({header, icon, paragraph, orderedlist}: ServicesProps) {
    return (
        <div className={styles.servicesbox}>
            <div className={styles.headerRow}>
            <h3>{header}</h3>
            <Image
                src={icon}
                alt="icon"
                width={52}
                height={52}
                style={{ objectFit: "contain" }}
            />
            </div>
            <p>{paragraph}</p>
            <ul>
                {orderedlist.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
            <Button text="Select Service" className={styles.servicesButton}
            />
        </div>
    )
}