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
                <li className={styles.navitem}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                        <FaTshirt size={16} />
                        </span>
                        <span className={styles.label}> Services </span>
                    </div>
                    
                </li>
                <li className={styles.navitem}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaPercent size={16} />
                        </span>
                        <span className={styles.label}> Promotions </span>
                    </div>  
                </li>
                <li className={styles.navitem}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaUsersCog size={16} />
                        </span>
                        <span className={styles.label}> Staff & Access </span>
                    </div>
                </li>
                <li className={styles.navitem}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCalendarCheck size={16} />
                        </span>
                        <span className={styles.label}> Bookings </span>
                    </div>
                </li>
                <li className={styles.navitem}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaChartBar size={16} />
                        </span>
                        <span className={styles.label}>  Reports & Analysis </span>
                    </div>
                </li>
                <li className={styles.navitem}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCog size={16} />
                        </span>
                        <span className={styles.label}> Systems </span>
                    </div>
                </li>  
            </ul>
        </nav>
    )
}