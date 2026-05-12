"use client";

import React, { useState } from "react";
import ControlPanelSidebar from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import styles from './controlpanellayout.module.css'
import { SearchBar } from "src/components/ui/SearchBar/SearchBar";

export default function ControlPanelLayout ({children} : {children: React.ReactNode}) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`${styles.cplayoutcontainer} ${open ? styles.open : styles.closed}`}>
            <aside className={styles.sidebaraside}>
                <section className={`${styles.cplsidebarcontainer} ${open ? styles.open: styles.closed}`}>
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
    )
}