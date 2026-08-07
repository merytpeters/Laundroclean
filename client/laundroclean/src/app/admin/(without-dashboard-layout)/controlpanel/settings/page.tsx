"use client";

import styles from "./settings.module.css";
import SettingsUI from "src/components/ui/SettingsUI/settingsUI";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { useAuth } from "src/context/AuthContext";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";


export default function AdminProfileSettings() {
  const { authUser, authProfile, isLoading, refetch, isError } = useAuth();

  if (isLoading) {
    return (
      <LoadingState />
    )
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load your profile."
        onRetry={refetch}
      />
    );
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