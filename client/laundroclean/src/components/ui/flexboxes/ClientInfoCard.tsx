"use client";
import { FaUser, FaEllipsisH } from "react-icons/fa";
import styles from "./ClientInfoCard.module.css"

type ClientInfoItem = {
    id: string;
    customerName: string;
    profilepic?: string;
    email: string;
    clientStatus: string;
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
    return (
        <div className={styles.clientInfocardcontainer}>
            <h4>{title.header}</h4>
            <span>{title.subheading}</span>
            
            <section aria-label="Client Info Card" className={styles.clientinfo}>
                {items.map((item)=> (
                    <div key={item.id} className={styles.infoitem}>
                        <div className={styles.infofirstrow}>
                            <span className={styles.profilepicicon}><FaUser size={12}/></span>
                            <span className={styles.infofirstinlinerow}>
                                <span className={styles.customername}>
                                    {item.customerName}
                                </span>
                                <span className={`${styles.status} ${styles[item.clientStatus]}`}>
                                    {item.clientStatus}
                                </span>
                            </span>
                        </div>
                        <div className={styles.infosecondrow}>
                            <span>{item.email}</span>
                            <span className={styles.infosecondinlinerow}><FaEllipsisH size={10}/></span>
                        </div>
                    </div>
                ))}

            </section>
            <p className={styles.viewmore}>view more</p>
        </div>
    )
}