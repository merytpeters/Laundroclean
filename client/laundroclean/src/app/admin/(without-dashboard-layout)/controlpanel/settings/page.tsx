"use client";

import { FaSpinner } from "react-icons/fa";
import styles from "./settings.module.css";
import SettingsUI from "src/components/ui/SettingsUI/settingsUI";
import { useCurrentUser } from "src/hooks/profile/useProfile";
import { mockCompanyAdmin } from "src/services/companyUser/mock";
import ErrorState from "src/components/ui/ErrorState/ErrorState";


export default function AdminProfileSettings () {
    const { data, isLoading, isError, refetch  }= useCurrentUser();
    const user = data?.user || mockCompanyAdmin;
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
            <SettingsUI user={user} profile={profile}/>
        </div>
    )
}