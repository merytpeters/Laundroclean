"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./staff-access.module.css";
import StaffTab from "src/components/ui/Tabs/StaffTab";
import RolesTab from "src/components/ui/Tabs/RolesTab";
import PermissionsTab from "src/components/ui/Tabs/PermissionsTab";

const tabs = [
    { key: "staff", label: "Staff" },
    { key: "roles", label: "Roles" },
    { key: "permissions", label: "Permissions" },
];

type TabKey = typeof tabs[number]["key"];

export default function StaffAccess() {
    const [activeTab, setActiveTab] =
        useState<TabKey>("staff");

    const [targetRoleId, setTargetRoleId] =
        useState<number | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    const toggleToPermissionTab = (roleId: number) => {
        /*
         * Get the page the user was on in Roles.
         *
         * Example:
         * rolesPage=3
         */
        const rolesPage =
            Number(searchParams.get("rolesPage")) || 1;

        /*
         * Store the role that was clicked.
         * PermissionsTab will use this ID to find
         * the exact role after it loads.
         */
        setTargetRoleId(roleId);

        /*
         * Copy the existing URL parameters.
         */
        const params = new URLSearchParams(searchParams);

        /*
         * Permissions should initially open on
         * the same page number as Roles.
         */
        params.set(
            "permissionsPage",
            rolesPage.toString()
        );

        /*
         * Switch to Permissions tab.
         */
        setActiveTab("permissions");

        /*
         * Update the URL without scrolling
         * the whole page to the top.
         */
        router.replace(
            `?${params.toString()}`,
            { scroll: false }
        );
    };

    return (
        <div
            className={
                styles.staffaccesscontainer
            }
        >
            {/* TAB HEADER */}
            <section
                className={
                    styles.headertab
                }
            >
                {/* Mobile tab selector */}
                <select
                    className={
                        styles.tabSelect
                    }
                    value={activeTab}
                    onChange={(e) => {
                        setActiveTab(
                            e.target.value as TabKey
                        );
                    }}
                    aria-label="Select tab"
                >
                    {tabs.map((tab) => (
                        <option
                            key={tab.key}
                            value={tab.key}
                        >
                            {tab.label}
                        </option>
                    ))}
                </select>

                {/* Desktop tab buttons */}
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                            setActiveTab(
                                tab.key
                            );
                        }}
                        className={`${styles.tabbtn} ${activeTab === tab.key
                                ? styles.active
                                : ""
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </section>

            {/* ACTIVE TAB */}
            <section
                className={
                    styles.activetabsection
                }
            >
                {activeTab === "staff" && (
                    <StaffTab />
                )}

                {activeTab === "roles" && (
                    <RolesTab
                        toggleToPermissionTab={
                            toggleToPermissionTab
                        }
                    />
                )}

                {activeTab === "permissions" && (
                    <PermissionsTab
                        targetRoleId={
                            targetRoleId
                        }
                    />
                )}
            </section>
        </div>
    );
}