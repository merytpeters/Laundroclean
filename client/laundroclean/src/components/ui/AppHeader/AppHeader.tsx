import styles from "./AppHeader.module.css"
import Logo from "../logo";

interface AppHeaderProp{
    userButton?: React.ReactNode;
    notificationButton?: React.ReactNode;
    settingsOrControlPanelButton?: React.ReactNode;
}

export default function AppHeader({userButton, notificationButton, settingsOrControlPanelButton}: AppHeaderProp) {
    return (
        <header className={styles.header}>
            <div className={styles.leftProps}>
            <Logo />
            {userButton}
            </div>
            <div className={styles.leftProps}>
            {notificationButton}
            {settingsOrControlPanelButton}</div>
        </header>
    )
}