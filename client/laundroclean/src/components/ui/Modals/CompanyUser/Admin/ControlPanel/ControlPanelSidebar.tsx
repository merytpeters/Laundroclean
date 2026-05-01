"use client";

import { useState } from 'react'
import styles from './ControlPanelSidebar.module.css'
import { FaCog, FaFileAlt, FaPercent, FaCalendarCheck, FaChartBar, FaUsersCog, FaTshirt} from 'react-icons/fa';

export default function ControlPanelSidebar () {
    const [open, setOpen] = useState(false);

    return (
        <nav className={styles.nav}>
            <ul className={styles.navlist}>
                <li className={`${styles.navitem} ${open ? styles.open : ""}`}>
                    <span className={styles.icon}>
                        <FaFileAlt size={16} />
                    </span>
                     <span className={styles.label}> Content </span>
                    <button onClick={() => setOpen(prev => !prev)} className={styles.navtrigger}> 
                        <span className={styles.chevron}>v</span>
                    </button>
                    <ul className={styles.dropdown}>
                        <li>
                            Home page Content
                        </li>
                        <li>
                            About Page Content
                        </li>
                    </ul>
                </li>
                <li className={styles.navitem}>
                    <span className={styles.icon}>
                        <FaTshirt size={16} />
                    </span>
                    <span className={styles.label}> Services </span>
                </li>
                <li className={styles.navitem}>
                    <span className={styles.icon}>
                        <FaPercent size={16} />
                    </span>
                    <span className={styles.label}> Promotions </span>
                    
                </li>
                <li className={styles.navitem}>
                    <span className={styles.icon}>
                        <FaUsersCog size={16} />
                    </span>
                    <span className={styles.label}> Staff & Access </span>
                    
                </li>
                <li className={styles.navitem}>
                    <span className={styles.icon}>
                        <FaCalendarCheck size={16} />
                    </span>
                    <span className={styles.label}> Bookings </span>
                </li>
                <li className={styles.navitem}>
                    <span className={styles.icon}>
                        <FaChartBar size={16} />
                    </span>
                    <span className={styles.label}>  Reports & Analysis </span>
                </li>
                <li className={styles.navitem}>
                    <span className={styles.icon}>
                        <FaCog size={16} />
                    </span>
                    <span className={styles.label}> Systems </span>
                </li>
            </ul>
        </nav>
    )
}