"use client";

import AppHeader from 'src/components/ui/AppHeader/AppHeader';
import ActionButton from 'src/components/ui/ActionButton/ActionButton';
import styles from 'src/components/layouts/UserLayout.module.css';
import { BellIcon, Cog6ToothIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { roleConfig } from 'src/lib/company-user/role-config';
import { mockCompanyAdmin } from 'src/services/companyUser/mock';
import BackButton from 'src/components/ui/Button/BackButton';
import { useCurrentUser } from 'src/hooks/profile/useProfile';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const userProfile = useCurrentUser();
    const user = userProfile.data?.user || mockCompanyAdmin;
    const userRole = "role" in user ? user.role : mockCompanyAdmin.role;
    const config = roleConfig[userRole];
    const isControlPanel = config.settingsAction === "CONTROL PANEL";


    return (
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
)}