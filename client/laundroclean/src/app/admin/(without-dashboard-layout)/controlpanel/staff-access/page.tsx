"use client";

import { useState } from 'react';
import styles from './staff-access.module.css';
import StaffTab from 'src/components/ui/Tabs/StaffTab';
import RolesTab from 'src/components/ui/Tabs/RolesTab';
import PermissionsTab from 'src/components/ui/Tabs/PermissionsTab';

const tabs = [
    {key: "staff", label: "Staff", component: <StaffTab />},
    {key: "roles", label: "Roles", component: <RolesTab />},
    {key: "permissions", label: "Permissions", component: <PermissionsTab />},
]

type TabKey = typeof tabs[number]["key"];

// style a slider
export default function StaffAccess () {
    const [activeTab, setActiveTab] = useState<TabKey>("staff");

    return (
        <div className={styles.staffaccesscontainer}>
            <section className={styles.headertab}>
                {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`${styles.tabbtn} ${activeTab === tab.key ? styles.active : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
                
            </section>
            <section>
                {tabs.find((t) => t.key === activeTab)?.component}
            </section>
        </div>
    )
}