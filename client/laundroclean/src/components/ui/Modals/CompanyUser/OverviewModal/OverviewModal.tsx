"use client";
import StatCard from "src/components/ui/flexboxes/StatCard";
import { roleConfig } from "src/lib/company-user/role-config";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { statMeta } from "src/components/ui/StatMeta";
import styles from "./OverviewModal.module.css"

export default function Overview() {
    const { user } = useCompanyUserMenu();

    const config = roleConfig[user.role];
    const stats = {}; // Replace with actual stats data source
    
    return (
        <div className={styles.overviewmodalcontainer}>
            <section className={styles.statcardbox}>
                {config.statCards?.map((card) => {
                    const meta = statMeta[card.key as keyof typeof statMeta];

                    return (
                        <StatCard
                            key={card.key}
                            header={card.title}
                            text={meta?.text}
                            icon={meta?.icon}
                            unit={meta?.unit}
                            value={stats[card.key as keyof typeof stats]}
                        />
                    );
                })}
            </section>
        </div>
    );
}