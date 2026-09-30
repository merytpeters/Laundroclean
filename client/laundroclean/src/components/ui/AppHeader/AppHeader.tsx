"use client";

import styles from "./AppHeader.module.css"
import Logo from "../logo";
import { useAuth } from "src/context/AuthContext";
import { FaPen, FaUserCircle } from "react-icons/fa";

interface AppHeaderProp {
    userButton?: React.ReactNode;
    notificationButton?: React.ReactNode;
    settingsOrControlPanelButton?: React.ReactNode;
    backbutton?: React.ReactNode;
    showProfilePic?: boolean;
}

export default function AppHeader({ userButton, notificationButton, settingsOrControlPanelButton, backbutton, showProfilePic = true }: AppHeaderProp) {
    const { authProfile } = useAuth();

    if (!authProfile) return;
    return (
        <header className={styles.header}>
            <div className={styles.leftProps}>
                <Logo />
                {userButton}
                {showProfilePic && (
                    <span className={styles.profilepic}>
                        {authProfile?.avatarUrl ? (
                            <img src={authProfile.avatarUrl} alt="Profle" className={styles.profilepic} />
                        ) : (

                            <FaUserCircle size={45} className={styles.profilepic} />
                        )}
                            <FaPen size={35} className={styles.penicon}/>
                    </span>
                )}
            </div>
            <div className={styles.rightProps}>
                {notificationButton}
                {settingsOrControlPanelButton}
                {backbutton}
            </div>
        </header>
    )
}