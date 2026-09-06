"use client";
import StatCard from "src/components/ui/flexboxes/StatCard";
import { roleConfig } from "src/lib/company-user/role-config";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { statMeta } from "src/components/ui/StatMeta";
import styles from "./OverviewModal.module.css"
import ScheduleCard from "src/components/ui/flexboxes/ScheduleCard";
import { mapDeliveryType, mapBookingStatus } from "src/types/booking/bookingStatus";
import ClientInfoCard from "src/components/ui/flexboxes/ClientInfoCard";
import { bookingScheduleData } from "../../../../../services/bookingService/bookingMockData";
import { clientInfoData } from "src/services/userService/mock";
import Button from "src/components/ui/Button/Button";
import { controlpanelbasepath } from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import { useGetUsers } from "src/hooks/companyUser/useUser/useUser";
import { useGetbookings } from "src/hooks/booking/useBooking";

export default function Overview() {
    const { user } = useCompanyUserMenu();
    const userQueryParams = {
        status: "active"
    } as const
    const {data: totalClientUsersData } = useGetUsers({type: "CLIENT"}, userQueryParams)
    const totalClientUsers = totalClientUsersData?.data;

    const { data: bookingData } = useGetbookings({});
    const activeConfirmedBookings = Array.isArray(bookingData?.data)
        ? bookingData.data
        : [];;

    if (!user.uiRole) return null;

    const config = roleConfig[user.uiRole];

    const stats = {
        activeClient: totalClientUsers?.length,
        activeBookings: activeConfirmedBookings?.filter(
            (booking) => {
                booking.status === "CONFIRMED",
                booking.isActive
            }
            
        ).length
    }

    const mappedDelivery =bookingScheduleData.map((item) => ({
        ...item,
        deliveryType: mapDeliveryType(item.deliveryType)
    }))

    const mappedSchedule = mappedDelivery.map((item) => ({
        ...item,
        status: mapBookingStatus(item.status, { deliveryType: item?.deliveryType}),
    }))
    

    const clientInfoHeaderData = {
        header: config.clientInfoCardTitle,
        subheading: config.clientInfoCardMessage,
    }

    // clientinfodetails will come from calendar

    
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
            {user?.uiRole === "ADMIN" && <Button text="View Reports" className={styles.viewreportbtn} href={`${controlpanelbasepath}/reports-analysis`}/>}
               
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