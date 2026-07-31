"use client";

import StatCard from "src/components/ui/flexboxes/StatCard";
import { AdminCPStatMeta } from "src/components/ui/StatMeta";
import { roleConfig } from "src/lib/company-user/role-config";
import { stats } from 'src/services/bookingService/bookingMockData';
import styles from 'src/app/admin/(without-dashboard-layout)/controlpanel/reports-analysis/reportsanalysis.module.css';
import { mockCompanyAdmin } from "src/services/companyUser/mock";
import RevenueChart from "src/components/ui/Charts/RevenueChart";
import PromoUsageChart from "src/components/ui/Charts/PromoUsageChart";

export default function ControlPanel () {
    const user = mockCompanyAdmin;
    
    const config = roleConfig[user.uiRole];
    return (
        <div className={styles.cpoverviewcontainer}>
            <section aria-label="CP Analysis Card" className={styles.statcardbox}>
                {config.AdminCPStatCards?.map((card) => {
                    const meta = AdminCPStatMeta[card.key as keyof typeof AdminCPStatMeta];

                    return (
                        <StatCard
                            key={card.key}
                            header={card.title}
                            text={meta?.text}
                            icon={meta?.icon}
                            unit={meta?.unit}
                            iconColor={meta?.iconColor}
                            value={stats[card.key as keyof typeof stats]}
                        />
                    );
                })}
            </section>
           <section className={styles.insights}>
             <span>
                <RevenueChart />
             </span>
           </section>
           <section>
                <PromoUsageChart />
            </section>
           <section className={styles.recentactivities}>
            {/*<span> Recent Activities</span>*/}
           </section> 
        </div>
    )
}