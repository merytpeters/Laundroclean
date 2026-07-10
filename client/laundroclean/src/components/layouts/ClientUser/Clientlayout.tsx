"use client";

import React, {useState} from "react";
import AppHeader from 'src/components/ui/AppHeader/AppHeader';
import ActionButton from 'src/components/ui/ActionButton/ActionButton';
import styles from 'src/components/layouts/UserLayout.module.css';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import BackButton from 'src/components/ui/Button/BackButton';
import { Client } from "src/types/users/user"
import WelcomeMessage from "src/components/ui/WelcomeMessage/WelcomeMessage";
import ClientSidebar from "src/components/ui/Modals/ClientUser/ClientSidebar";
import contentstyles from 'src/app/admin/(without-dashboard-layout)/controlpanel/controlpanellayout.module.css';
import { SearchBar } from "src/components/ui/SearchBar/SearchBar";


interface ClientLayoutProps {
    user: Client;
    children: React.ReactNode;
    welcomeMessage?: { name: string; message?: string, showProfilePic?: boolean };
}

export default function ClientLayout({ user, children, welcomeMessage }: ClientLayoutProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className={styles.layoutContainer}>
            { user && <AppHeader
                userButton={
                    <ActionButton
                        text="Dashboard"
                        href="/user/dashboard"
                        className={styles.dashboardButton}
                    />
                }
                

                notificationButton={
                    <ActionButton
                        icon={<BellIcon className={styles.iconStyle} />}
                        text="Notifications"
                        className={styles.iconButton}
                    // onClick={() => console.log("Open notifications")}
                    />
                }

                settingsOrControlPanelButton={
                    <ActionButton
                        icon={
                            <Cog6ToothIcon className={styles.iconStyle} />
                        }
                        text="Settings"
                        href="/user/settings"
                        className={styles.iconButton}
                    />
                }

                backbutton={
                    <BackButton />
                }
            />}

            
            <div className={styles.contentWrapper}>
                <div className={`${contentstyles.cplayoutcontainer} ${open ? contentstyles.open : contentstyles.closed}`}>
                
                    <aside className={contentstyles.sidebaraside}>
                        <section className={`${contentstyles.cplsidebarcontainer} ${open ? contentstyles.open: contentstyles.closed}`}>
                            <ClientSidebar/>
                        </section>
                        <button onClick={() => setOpen(prev => !prev)} className={contentstyles.toggleBtn}> 
                            <span className={contentstyles.circle}>
                                &gt;
                            </span> 
                        </button>
                    </aside>
                            
                    <section className={contentstyles.cpbody}>
                        {welcomeMessage && (
                        <div className={styles.clientwelcomeWrapper}>
                                     <WelcomeMessage
                                         name={welcomeMessage.name}
                                         message={welcomeMessage.message}
                                         showProfilePic={false}
                                     />
                        </div>
                        )}
                        <section className={contentstyles.cpsearchbar}>
                            <SearchBar />
                        </section>
                        <section className={contentstyles.cplpagechildren}>
                            {children}
                        </section>
                    </section>
                </div>

            </div>
        </div>
    );
}