"use client";

import React, { useState } from "react";
import ControlPanelSidebar from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import styles from './controlpanellayout.module.css'
import { SearchBar } from "src/components/ui/SearchBar/SearchBar";
import { CompanyUserMenuProvider } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { useCurrentUser } from "src/hooks/profile/useProfile";
import { mockCompanyAdmin } from "src/services/companyUser/mock";
import { mockClient } from "src/services/clientuser/mock";
import { redirect } from "next/navigation";


export default function ControlPanelLayout({children} : {children: React.ReactNode}) {
    const [open, setOpen] = useState(false);

    const userProfile = useCurrentUser();
    console.log(userProfile);
    const user = userProfile.data?.user || mockCompanyAdmin || mockClient;

    if (!user || user.type !== "COMPANYUSER") return (
        redirect("/login")
    )

    return (
        <CompanyUserMenuProvider user={user}>
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