"use client";

import styles from 'src/components/ui/Modals/Sidebar.module.css';
import { FaPercent, FaCalendarCheck, FaTshirt, FaUser, FaCreditCard, FaUserShield, FaCog} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const clientsidebarbasepath = "/user"

export default function ClientSidebar () {
    const path = usePathname();

    return (
        <nav className={styles.nav}>
            <ul className={styles.navlist}>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/dashboard` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaUserShield size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/dashboard`} className={styles.label}> Dashboard </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/profile` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaUser size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/profile`} className={styles.label}> Profile </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/bookings` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCalendarCheck size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/bookings`} className={styles.label}> Bookings </Link>
                    </div>
                </li>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/laundroclean-services` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                        <FaTshirt size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/laundroclean-services`} className={styles.label}> Services </Link>
                    </div>
                    
                </li>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/promotions` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaPercent size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/promotions`} className={styles.label}> Promotions </Link>
                    </div>  
                </li>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/payment` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCreditCard size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/payment`} className={styles.label}> Payment </Link>
                    </div>  
                </li>
                <li className={`${styles.navitem} ${path === `${clientsidebarbasepath}/user-settings` ? styles.active : ""}`}>
                    <div className={styles.navrow}>
                        <span className={styles.icon}>
                            <FaCog size={16} />
                        </span>
                        <Link href={`${clientsidebarbasepath}/user-settings`} className={styles.label}> Settings </Link>
                    </div>  
                </li>
            </ul>
        </nav>
    )
}