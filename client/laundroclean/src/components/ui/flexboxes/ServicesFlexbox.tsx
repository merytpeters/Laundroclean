import Image from "next/image";
import React from "react";
import { FaShirtsinbulk } from "react-icons/fa6";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Button from "../Button/Button";
import styles from "./ServicesFlexbox.module.css";
import { ServiceDisplayProp } from "src/services/laundrocleanservices/laundrocleanservices.service";
import CornerRightArrow from "../angledarrow";

interface ServicesProps {
    icon?: string | StaticImport;
    name: string;
    description: string;
    orderedlist?: string[];
}

export function Services({name, icon, description, orderedlist}: ServicesProps) {
    return (
        <div className={styles.servicesbox}>
            <div className={styles.headerRow}>
            <h3>{name}</h3>
            {icon ? <Image
                src={icon}
                alt="icon"
                width={52}
                height={52}
                style={{ objectFit: "contain" }}
            />: <FaShirtsinbulk />}
            </div>
            <p>{description}</p>
            <ul>
                {orderedlist?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
            <Button text="Select Service" className={styles.servicesButton}
            />
        </div>
    )
}

export function DashboardServices({ name, description, pricingType, amount, currency}: ServiceDisplayProp) {
    return (
        <div className={styles.dashboardservices}>
            <span className={styles.cornerrightarrow}>
                <CornerRightArrow />
            </span>
            
            <span>{currency} {amount} {pricingType}</span>
            <span>{description}</span>
            <span><b>{name}</b></span>
        </div>
    )
}