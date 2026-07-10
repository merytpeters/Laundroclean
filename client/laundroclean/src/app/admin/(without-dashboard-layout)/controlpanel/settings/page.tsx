import styles from "./settings.module.css";
import SettingsUI from "src/components/ui/SettingsUI/settingsUI";

export default function AdminProfileSettings () {
    return (
        <div className={styles.pageContainer}>
            <h3>Account Settings</h3>
            <SettingsUI />
        </div>
    )
}