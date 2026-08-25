"use client";
import { FaUserCircle, FaEllipsisH } from "react-icons/fa";
import styles from "./ClientInfoCard.module.css"
import { useState } from "react";

type ClientInfoItem = {
    id: string;
    firstName: string;
    lastName: string;
    profilepic?: string;
    email: string;
    isActive: boolean;
}

interface ClientInfoHeaderProps {
    header: string;
    subheading: string;
}

type ClientInfoProps = {
    title: ClientInfoHeaderProps
    items: ClientInfoItem[];
}

export default function ClientInfoCard ({title, items}: ClientInfoProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={styles.clientInfocardcontainer}>
            <h4>{title.header}</h4>
            <span>{title.subheading}</span>
            
            <section aria-label="Client Info Card" className={`${styles.clientinfo} ${expanded ? styles.expanded : ""}`}>
                {items.map((item)=> (
                    <div key={item.id} className={styles.infoitem}>
                        <span className={styles.profilepicicon}><FaUserCircle size={30}/></span>
                        <div className={styles.infofirstrow}>
                            <span className={styles.infofirstinlinerow}>
                                <span className={styles.customername}>
                                    {item.firstName} {item.lastName}
                                </span>
                                <span className={`${styles.status} ${styles[item.isActive ? "active": "inactive"]}`}>
                                    {item.isActive ? "active" : "inactive"}
                                </span>
                            </span>
                        
                            <div className={styles.infosecondrow}>
                                <span>{item.email}</span>
                                <span className={styles.infosecondinlinerow}><FaEllipsisH size={10}/></span>
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