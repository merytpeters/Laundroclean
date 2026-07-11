"use client";

import { useCurrentUser } from 'src/hooks/profile/useProfile';
import styles from '../../admin/(without-dashboard-layout)/controlpanel/settings/settings.module.css';
import SettingsUI from 'src/components/ui/SettingsUI/settingsUI';
import { mockClient } from 'src/services/clientuser/mock';
import { FaSpinner } from 'react-icons/fa';
import ErrorState from 'src/components/ui/ErrorState/ErrorState';

export default function ClientSettings() {

    const { data, isLoading, isError, refetch } = useCurrentUser();
    const user = data?.user || mockClient;
    const profile = data?.profile;
    if (isLoading) return <FaSpinner />;
    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        )
    }
    return (
        <div className={styles.pageContainer}>
            <h3>Account Settings</h3>
            <SettingsUI user={user} profile={profile} />
        </div>
    )
}