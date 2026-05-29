"use client";
import StatCard from "src/components/ui/flexboxes/StatCard";
import { roleConfig } from "src/lib/company-user/role-config";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { statMeta } from "src/components/ui/StatMeta";
import styles from "./OverviewModal.module.css"
import ScheduleCard from "src/components/ui/flexboxes/ScheduleCard";
import { mapDeliveryType, mapBookingStatus } from "src/types/bookingStatus";
import ClientInfoCard from "src/components/ui/flexboxes/ClientInfoCard";
import { stats, bookingScheduleData, clientInfoData } from "./OverviewMockData";
import Button from "src/components/ui/Button/Button";
import { controlpanelbasepath } from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";

export default function Overview() {
    const { user } = useCompanyUserMenu();

    const config = roleConfig[user.role];

    const mappedDelivery =bookingScheduleData.map((item) => ({
        ...item,
        deliveryType: mapDeliveryType(item.deliveryType)
    }))

    console.log(mappedDelivery);

    const mappedSchedule = mappedDelivery.map((item) => ({
        ...item,
        status: mapBookingStatus(item.status, { deliveryType: item?.deliveryType}),
    }))

    console.log(mappedSchedule);
    

    const clientInfoHeaderData = {
        header: config.clientInfoCardTitle,
        subheading: config.clientInfoCardMessage,
    }

    
    return (
        <div className={styles.overviewmodalcontainer}>
            <section aria-label="Analysis Card" className={styles.statcardbox}>
                {config.statCards?.map((card) => {
                    const meta = statMeta[card.key as keyof typeof statMeta];

                    return (
                        <StatCard
                            key={card.key}
                            header={card.title}
                            text={meta?.text}
                            icon={meta?.icon}
                            iconColor={meta.iconColor}
                            unit={meta?.unit}
                            value={stats[card.key as keyof typeof stats]}
                        />
                    );
                })}
            </section>
            {user?.role === "ADMIN" && <Button text="View Reports" className={styles.viewreportbtn} href={`${controlpanelbasepath}/reports-analysis`}/>}
               
            <section aria-label="Information Section" className={styles.infosection}>
                <ScheduleCard items={mappedSchedule}/>
                <ClientInfoCard
                  title={clientInfoHeaderData}
                  items={clientInfoData}
                />
            </section>
        </div>
    );
}