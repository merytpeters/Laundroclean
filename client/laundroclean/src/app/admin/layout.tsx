"use client";

import AppHeader from 'src/components/ui/AppHeader/AppHeader';
import ActionButton from 'src/components/ui/ActionButton/ActionButton';
import styles from 'src/components/layouts/UserLayout.module.css';
import { BellIcon, Cog6ToothIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { roleConfig } from 'src/lib/company-user/role-config';
import BackButton from 'src/components/ui/Button/BackButton';
import ProtectedRoute from 'src/components/ui/ProtectedRoutes';
import { useAuth } from 'src/context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import ErrorState from 'src/components/ui/ErrorState/ErrorState';
import { LoadingState } from 'src/components/ui/ErrorState/ErrorState';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const { authUser, isLoading, refetch, isError } = useAuth();

    console.log({
        authUser,
        isLoading,
        isError,
    });

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

    if (!authUser || authUser.type !== "COMPANYUSER" || authUser.uiRole !== "ADMIN") {
        return null
    }

    const userRole = "uiRole" in authUser ? authUser.uiRole : undefined;
    const config = userRole ? roleConfig[userRole] : undefined;
    const isControlPanel =
        config?.settingsAction === "CONTROL PANEL";


    return (
        <ProtectedRoute>
            <div>
                <div className={styles.layoutContainer}>
                    <AppHeader
                        userButton={
                            config && (
                                <ActionButton
                                    text={config.dashboardText}
                                    href={config.dashboardHref}
                                    className={styles.dashboardButton}
                                />
                            )
                        }


                        notificationButton={
                            config?.showNotifications ? (
                                <ActionButton
                                    icon={<BellIcon className={styles.iconStyle} />}
                                    text="Notifications"
                                    className={styles.iconButton}
                                // onClick={() => console.log("Open notifications")}
                                />
                            ) : null
                        }

                        settingsOrControlPanelButton={
                            config && (
                                <ActionButton
                                    icon={
                                        isControlPanel ? (
                                            <WrenchScrewdriverIcon className={styles.iconStyle} />
                                        ) :
                                            (
                                                <Cog6ToothIcon className={styles.iconStyle} />
                                            )
                                    }
                                    text={isControlPanel ? "Control Panel" : "Settings"}
                                    href={config.settingsHref}
                                    className={styles.iconButton}
                                />
                            )
                        }

                        backbutton={
                            <BackButton />
                        }
                    />
                </div>
                {children}
            </div>
        </ProtectedRoute>
    )
}