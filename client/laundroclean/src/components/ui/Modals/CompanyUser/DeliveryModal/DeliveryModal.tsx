import StatCard from "src/components/ui/flexboxes/StatCard";
import { roleConfig } from "src/lib/company-user/role-config";
import styles from "./DeliveryModal.module.css"
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { DeliveryStatMeta } from "src/components/ui/StatMeta";
import { useGetbookings } from "src/hooks/booking/useBooking";
import { transformFieldInArray } from "src/utils/mapData";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";

export default function DeliveryModal() {
    const { user } = useCompanyUserMenu();
    const { data } = useGetbookings({
        params: {
            includeProfile: true,
        }
    });

    const bookingData = Array.isArray(data?.data)
        ? data.data
        : [];

    const mappedCurrencyBookingData = transformFieldInArray(
        bookingData,
        "currency",
        mapCurrencySymbol
    );

    /*const mappedBookingData = transformFieldInArray(
        mappedCurrencyBookingData,
        "deliveryType",
        mapDeliveryType
    );*/

    const pendingDoorStepPickups = mappedCurrencyBookingData.filter(
        (booking) => {
            return booking.status === "CONFIRMED" && booking.deliveryType === "PICK_UP"
        })

    const pendingBulkPickups = mappedCurrencyBookingData.filter(
        (booking) => {
            return booking.status === "CUSTOMER_DROPPED_OFF_AT_POINT" && booking.deliveryType === "DROP_OFF"
        })

    const pendingDoorStepDeliveries = mappedCurrencyBookingData.filter(
        (booking) => {
            return booking.status === "WASHED"
            && booking.deliveryType === "PICK_UP"
        })

    const stats = {
        pendingDoorStepPickups: pendingDoorStepPickups.length,
        pendingBulkPickups: pendingBulkPickups.length,
        pendingDoorStepDeliveries: pendingDoorStepDeliveries.length
    };

    console.log("PENDING BULK PICKUP:", stats.pendingBulkPickups)
    if (!user.uiRole) return null;

    const config = roleConfig[user.uiRole];
    return (
        <div className={styles.deliverymodalcontainer}>
            <section aria-label="Booking Stat Card" className={styles.statcardbox}>
                {config.DeliveryStatCards?.map((card) => {
                    const meta = DeliveryStatMeta[card.key as keyof typeof DeliveryStatMeta];

                    return (
                        <StatCard
                            key={card.key}
                            header={card.title}
                            text={meta?.text}
                            icon={meta?.icon}
                            iconColor={meta?.iconColor}
                            unit={meta?.unit}
                            value={stats[card.key as keyof typeof stats]}
                        />
                    );
                })}
            </section>

            <section aria-label="Delivery display Section" className={styles.infosection}>

            </section>
        </div>
    )
}