"use client";
import React, { useEffect } from "react";
import { IconType } from "react-icons";
import styles from "./StatCard.module.css";

export interface StatCardProps {
    icon?: IconType;
    header: string;
    text?: string;
    value?: number | string;
    unit?: string;
    iconColor?: string;
    className?: string;
}

export default function StatCard({icon: Icon, header, text, value, unit, iconColor, className}: StatCardProps) {
    const iconStyle = iconColor ? { color: iconColor } : undefined;

    useEffect(() => {
        console.log("StatCard header (client):", header);
    }, [header]);

    return (
        <div className={`${styles.statsbox} ${className || ""}`}>
            <div className={styles.rowelement}>
                <p><b>{header}</b></p>
                {Icon ? <span className={styles.icon} style={iconStyle}><Icon size={16} /></span> : null}
            </div>
            <span>{unit}{text}</span>
            <span>{value}</span>
        </div>
    )
}