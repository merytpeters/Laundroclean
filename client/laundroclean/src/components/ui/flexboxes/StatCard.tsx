"use client";
import React from "react";
import { IconType } from "react-icons";
import styles from "./StatCard.module.css";

export interface StatCardProps {
    icon?: IconType;
    header: string;
    text?: string;
    value?: number | string;
    unit?: string;
}

export default function StatCard({icon: Icon, header, text, value, unit}: StatCardProps) {
    return (
        <div className={styles.statsbox}>
            <div className={styles.rowelement}>
                <p><b>{header}</b></p>
                {Icon ? <span className={styles.icon}><Icon size={16} /></span> : null}
            </div>
            <span>{unit}{text}</span>
            <span>{value}</span>
        </div>
    )
}