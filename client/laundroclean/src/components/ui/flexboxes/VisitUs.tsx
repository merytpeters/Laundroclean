import React from "react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import styles from "./VisitUs.module.css"

interface LocationProps {
    header: string;
    icon: string | StaticImport;
    className?: string;
    paragraphs: string[];
    button?: React.ReactNode;
    orderedlist?: string[];
}

export default function Location({ header, icon, className, paragraphs, button, orderedlist }: LocationProps) {
    const isHours = header.toLowerCase().includes("hour");
    return (
        <div className={`${styles.visitusBox} ${className || ""}`}>
            <div className={styles.headerRow}>
                <Image
                    src={icon}
                    alt="icon"
                    width={20}
                    height={20}
                />
                <h4>{header}</h4>
            </div>
            <br />
            <div className={styles.paragraphs}>
                {paragraphs.map((item, idx) => {
                    if (isHours && /\d/.test(item)) {
                        const [days, ...timeParts] = item.replace(/\s+/g, " ").trim().split(/\s(?=\d)/);
                        const time = timeParts.join(" ");
                        return (
                            <p key={idx} className={styles.hoursRow}>
                                <span className={styles.days}>{days}</span>
                                <span className={styles.time}>{time}</span>
                            </p>
                        );
                    }
                    return <p key={idx}>{item}</p>;
                })}
            </div>
            <br />
            {orderedlist && (
                <ul>
                    {orderedlist.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            )}
            {button}
        </div>
    )
}