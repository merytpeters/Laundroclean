"use client";

import React, { useState } from "react";
import ControlPanelSidebar from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import styles from './controlpanellayout.module.css'
import { SearchBar } from "src/components/ui/SearchBar/SearchBar";
import { CompanyUserMenuProvider } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { useAuth } from "src/context/AuthContext";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import ErrorState from "src/components/ui/ErrorState/ErrorState";


export default function ControlPanelLayout({ children }: { children: React.ReactNode }) {
    const { authUser, isLoading, refetch, isError } = useAuth();
    const [open, setOpen] = useState(false);

    //console.log({ authUser, isLoading, isError });

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
        return null;
    }

    return (
        <CompanyUserMenuProvider user={authUser}>
            <div className={`${styles.cplayoutcontainer} ${open ? styles.open : styles.closed}`}>
                <aside className={styles.sidebaraside}>
                    <section className={`${styles.cplsidebarcontainer} ${open ? styles.open : styles.closed}`}>
                        <ControlPanelSidebar />
                    </section>

                    <button onClick={() => setOpen(prev => !prev)} className={styles.toggleBtn}>
                        <span className={styles.circle}>
                            &gt;
                        </span>
                    </button>
                </aside>

                <section className={styles.cpbody}>

                    <section className={styles.cpsearchbar}>
                        <SearchBar />
                    </section>
                    <section className={styles.cplpagechildren}>
                        {children}
                    </section>

                </section>

            </div>
        </CompanyUserMenuProvider>
    )
}