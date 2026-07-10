import styles from '../../admin/(without-dashboard-layout)/controlpanel/settings/settings.module.css';
import SettingsUI from 'src/components/ui/SettingsUI/settingsUI';

export default function ClientSettings () {
    return (
        <div className={styles.pageContainer}>
            <h3>Account Settings</h3>
            <SettingsUI />
        </div>
    )
}