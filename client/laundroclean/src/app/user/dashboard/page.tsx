"use client";

import { DashboardServices } from "src/components/ui/flexboxes/ServicesFlexbox";
import styles from "./dashboard.module.css";
import { mapCurrencySymbol, mapPricingType } from "src/types/laundrocleanServices/laundroservices";
import ActiveOrder from "src/components/ui/flexboxes/ActiveOrder";
import PromoCard from "src/components/ui/flexboxes/PromoCard";
import { useServices } from "src/hooks/laundroCleanServices/useServices";
import { useGetClientbookings } from "src/hooks/booking/useBooking";
import { transformFieldInArray } from "src/utils/mapData";
import { BookingDto } from "src/types/booking/booking.dto";
import { mapDeliveryType } from "src/types/booking/bookingStatus";

export default function ClientDashboard() {
    const { data } = useServices({
        params: {
            page: 1,
            limit: 10,
            includeDeleted: 'false'
        }
    })

    const services = data?.data ?? [];

    const { data: bookingData } = useGetClientbookings({})

    const bookingDetails = Array.isArray(bookingData?.data)
        ? bookingData.data
        : []

    const mappedCurrency = transformFieldInArray(bookingDetails, "currency", mapCurrencySymbol)

    const mappedDelivery: BookingDto[] = transformFieldInArray(mappedCurrency, "deliveryType", mapDeliveryType)

    const activeOrdersData = mappedDelivery.filter(
        (booking) => {
            return booking.status !== "CANCELLED" 
            && booking.status !== "PENDING"
            && booking.status !== "COMPLETED"
        }
    )

    return (
        <div className={styles.clientdashboardcontainer}>
            <section aria-describedby="laundrocleanservices display" className={styles.servicesdisplaysection}>
                <span className={styles.displaytext}><b> <i>Here&apos;s</i> our Laundry Services.</b></span>
                <span className={styles.servicesdisplaybox}>
                    {services.length !== 0 ? (services?.slice(0, 8).map((service) => {
                        return (
                            <DashboardServices
                                key={service.id}
                                name={service.name}
                                description={service?.description}
                                pricingType={
                                    service.prices?.[0]
                                        ? mapPricingType(service.prices?.[0]?.pricingType) : ""}
                                amount={service.prices?.[0]
                                    ? service.prices?.[0]?.amount : 0}
                                currency={service.prices?.[0]
                                    ? mapCurrencySymbol(service.prices?.[0]?.currency) : ""}
                            />
                        )
                    })): (
                        <span><b><i>All available services will be displayed here</i></b></span>
                    )}
                </span>
                <a href="/user/laundroclean-services#all-services" className={styles.seeallbutton}>See all</a>
            </section>
            <section className={styles.activeorderssection}>
                <span className={styles.sectionheader}><b>Active Orders</b></span>
                <section className={styles.activeordersdisplaybox}>
                    {/* Active Orders/Order status: Orders that are not yet delivered but confirmed (paid) */}
                    {activeOrdersData.length !== 0 ? (
                        <ActiveOrder data={activeOrdersData} />
                    ) : (
                        <span><i>Active Orders will show here</i></span>
                    )}
                </section>
                <a href="/user/bookings" className={styles.seeallbutton}>See all</a>
            </section>
            <section className={styles.specialofferssection}>
                <span className={styles.sectionheader}> <b> Special Offer </b></span>
                <section className={styles.promocarddisplaybox}>
                    <PromoCard />
                </section>
                <a href="/user/promotions" className={styles.seeallbutton}>See all</a>
            </section>
        </div>
    )
}