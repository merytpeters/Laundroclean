"use client";

import { useState } from 'react';
import styles from 'src/components/ui/Modals/Sidebar.module.css';
import { FaCog, FaFileAlt, FaPercent, FaCalendarCheck, FaChartBar, FaUsersCog, FaTshirt, FaUsers, FaUser} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const controlpanelbasepath = "/admin/controlpanel"

export default function ControlPanelSidebar () {
    const [open, setOpen] = useState(false);
    const path = usePathname();
    

    return (
        <nav className={styles.nav}>
            <ul className={styles.navlist}>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/reports-analysis` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaChartBar size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/reports-analysis`} className={styles.label}>  Reports & Analysis </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${open ? styles.open : ""}`}>
                    <div className={styles.navrow}> 
                        <span className={styles.icon}>
                        <FaFileAlt size={16} />
                    </span>
                     <span className={styles.label}> Content </span>
                     <button onClick={() => setOpen(prev => !prev)} className={styles.navtrigger}> 
                        <span className={styles.chevron}>v</span>
                    </button>
                    </div>
                    <ul className={styles.dropdown}>
                        <li>
                            Home page Content
                        </li>
                        <li>
                            About Page Content
                        </li>
                    </ul>
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/laundroclean-services` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                        <FaTshirt size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/laundroclean-services`} className={styles.label}> Services </Link>
                    </div>
                    
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/promotions` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaPercent size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/promotions`} className={styles.label}> Promotions </Link>
                    </div>  
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/staff-access` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaUsersCog size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/staff-access`} className={styles.label}> Staff & Access</Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/bookings` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCalendarCheck size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/bookings`} className={styles.label}> Bookings </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/customers` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaUsers size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/customers`} className={styles.label}> Customers </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/settings` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaUser size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/settings`} className={styles.label}> Account Settings </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${controlpanelbasepath}/systems` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCog size={16} />
                        </span>
                        <Link href={`${controlpanelbasepath}/systems`} className={styles.label}> Systems </Link>
                    </div>
                </li>  
            </ul>
        </nav>
    )
}