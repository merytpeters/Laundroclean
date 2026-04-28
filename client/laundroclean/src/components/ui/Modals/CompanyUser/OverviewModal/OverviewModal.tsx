"use client";
import StatCard from "src/components/ui/flexboxes/StatCard";
import { roleConfig } from "src/lib/company-user/role-config";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { statMeta } from "src/components/ui/StatMeta";
import styles from "./OverviewModal.module.css"
import ScheduleCard from "src/components/ui/flexboxes/ScheduleCard";
import { mapDeliveryType, mapBookingStatus } from "src/types/bookingStatus";

export default function Overview() {
    const { user } = useCompanyUserMenu();

    const config = roleConfig[user.role];
    const stats = {}; // Replace with actual stats data source
    const bookingScheduleData = [
        {
            id: "1",
            time: "09:00 AM",
            customerName: "John Doe",
            serviceType: "Laundry Wash",
            status: "COMPLETED",
            deliveryType: "DROP_OFF"
        },
        {
            id: "2",
            time: "09:00 AM",
            customerName: "Michael Doe",
            serviceType: "Laundry Wash",
            status: "CUSTOMER_PICKED_UP_FROM_POINT",
            deliveryType: "PICK_UP"
        },
        {
            id: "3",
            time: "10:00 AM",
            customerName: "John Doe",
            serviceType: "Laundry Wash",
            status: "COMPANY_DROPPED_OFF_AT_POINT",
            deliveryType: "DROP_OFF"
        },
        {
            id: "4",
            time: "09:00 AM",
            customerName: "John Doe",
            serviceType: "Laundry Wash",
            status: "DELIVERED",
            deliveryType: "PICK_UP"
        },
    ]

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
                            unit={meta?.unit}
                            value={stats[card.key as keyof typeof stats]}
                        />
                    );
                })}
            </section>
               
            <section aria-label="Information Section" className={styles.infosection}>
                <ScheduleCard items={mappedSchedule}/>
                Customer Info
            </section>
        </div>
    );
}