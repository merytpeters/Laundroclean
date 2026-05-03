import React from "react";
import ControlPanelSidebar from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import styles from './controlpanellayout.module.css'
import SearchBar from "src/components/ui/SearchBar/SearchBar";

export default async function ControlPanelLayout ({children} : {children: React.ReactNode}) {
    return (
        <div className={styles.cplayoutcontainer}>

            <aside className={styles.cplsidebarcontainer}>
                <ControlPanelSidebar /> 
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