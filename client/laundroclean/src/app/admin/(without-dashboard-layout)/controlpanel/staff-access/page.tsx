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
                {/* Mobile-friendly select shown on small screens */}
                <select
                    className={styles.tabSelect}
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as TabKey)}
                    aria-label="Select tab"
                >
                    {tabs.map((tab) => (
                        <option key={tab.key} value={tab.key}>{tab.label}</option>
                    ))}
                </select>

                {/* Desktop buttons (hidden on small screens via CSS) */}
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