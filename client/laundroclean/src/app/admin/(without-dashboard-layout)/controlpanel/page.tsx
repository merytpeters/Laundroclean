"use client";

import StatCard from "src/components/ui/flexboxes/StatCard";
import { AdminCPStatMeta } from "src/components/ui/StatMeta";
import { roleConfig } from "src/lib/company-user/role-config";
import { stats } from '../../../../components/ui/Modals/CompanyUser/OverviewModal/OverviewMockData';
import styles from './controlpanelpage.module.css';
import { mockCompanyAdmin } from "src/lib/company-user/mock";
import Button from "src/components/ui/Button/Button";
import { FaPlus } from "react-icons/fa";
import { controlpanelbasepath } from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import RevenueChart from "src/components/ui/Charts/RevenueChart";

export default function ControlPanel () {
    const user = mockCompanyAdmin;
    
    const config = roleConfig[user.role];
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
            <section className={styles.quickactions}>
                <p>Quick Actions </p>
                <span className={styles.quickactionsbtns}>
                    <Button text="Create new role" className={styles.newrolebtn} href={`${controlpanelbasepath}/staff-access`}/>
                    <Button icon={<FaPlus />} text="Add staff" className={styles.addstaffbtn} href={`${controlpanelbasepath}/staff-access`}/>
                    <Button text="Create New Promos" className={styles.newpromobtn} href={`${controlpanelbasepath}/promotions`}/>
                    <Button text="View Reports" className={styles.viewreportbtn} href={`${controlpanelbasepath}/reports-analysis`}/>
                </span>
                
            </section>
           <section className={styles.insights}>
             Analytics
             <span>Insights , growth trend , charts
                <RevenueChart />
             </span>
           </section>
           <section className={styles.recentactivities}>
            <span> Recent Activities</span>
           </section> 
        </div>
    )
}