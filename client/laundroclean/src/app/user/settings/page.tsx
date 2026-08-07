"use client";

import styles from '../../admin/(without-dashboard-layout)/controlpanel/settings/settings.module.css';
import SettingsUI from 'src/components/ui/SettingsUI/settingsUI';
import { FaSpinner } from 'react-icons/fa';
import ErrorState from 'src/components/ui/ErrorState/ErrorState';
import { useAuth } from 'src/context/AuthContext';

export default function ClientSettings() {

    const { authUser, authProfile, isLoading, isError, refetch } = useAuth();

    if (isLoading) return <FaSpinner />;
    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        )
    }

    if (!authUser || !authProfile) {
        return null;
    }

    return (
        <div className={styles.pageContainer}>
            <h3>Account Settings</h3>
            <SettingsUI user={authUser} profile={authProfile} />
        </div>
    )
}