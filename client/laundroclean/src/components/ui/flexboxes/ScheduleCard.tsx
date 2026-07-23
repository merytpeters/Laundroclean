"use client";
import React from "react";
import { FaClock } from "react-icons/fa";
import styles from "./ScheduleCard.module.css";
import { statusClassMap } from "src/types/booking/bookingStatus";
import { useState } from "react";

type ScheduleItem = {
    id: string;
    time: string;
    customerName: string;
    serviceType: string;
    status: string;
    deliveryType: string;
}

type DailyScheduleProps = {
    items: ScheduleItem[];
}

export default function ScheduleCard ({items}: DailyScheduleProps) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={styles.schedulecardcontainer}>
            <h4>Today&apos;s Schedule</h4>
            <span>Current and upcoming bookings</span>

            <section aria-label="Daily Schedule Card" className={ `${styles.dailyschedule} ${expanded ? styles.expanded : ""}`}>
                {items.map((item) => (
                    <div key={item.id} className={styles.dailyitem}>
                        <span className={styles.icon}><FaClock size={14}/></span>
                        <div className={styles.firstrow}>
                            <span className={styles.firstinlinerow}>
                                <span className={styles.time}>
                                    {item.time}
                                </span>
                            
                                <span className={`${styles.status} ${styles[statusClassMap[item.status]]}`}>
                                    {item.status}
                                </span>
                            </span>
                            <div className={styles.secondrow}>
                                <span>{item.customerName}</span>
                                <span className={styles.secondinlinerow}>
                                    <span>• {item.serviceType}</span>
                                    <span>• {item.deliveryType}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

            </section>
            <div className={styles.actions}>
                <button onClick={() => setExpanded(!expanded)} className={styles.viewmore}>{ expanded ? "view less" : "view more" }</button>
            </div>
        </div>
    )
}