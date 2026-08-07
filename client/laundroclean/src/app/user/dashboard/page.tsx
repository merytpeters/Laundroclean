"use client";

import {DashboardServices } from "src/components/ui/flexboxes/ServicesFlexbox";
import styles from "./dashboard.module.css";
import { mapCurrencySymbol, mapPricingType } from "src/types/laundrocleanServices/laundroservices";
import ActiveOrder from "src/components/ui/flexboxes/ActiveOrder";
import PromoCard from "src/components/ui/flexboxes/PromoCard";
import { useServices } from "src/hooks/laundroCleanServices/useServices";

export default function ClientDashboard () {
    const { data } = useServices({
            params: {
                page: 1,
                limit: 10
            }
        })

    const services = data?.data ?? [];
    const filteredServices = services.filter(
        (service) => service.isActive === true
    );

    return (
        <div className={styles.clientdashboardcontainer}>
            <section aria-describedby="laundrocleanservices display" className={styles.servicesdisplaysection}>
                <span className={styles.displaytext}><b> <i>Here&apos;s</i> our Laundry Services.</b></span>
                <span className={styles.servicesdisplaybox}>
                    { filteredServices?.slice(0, 8).map((service) => {
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
                                ? mapCurrencySymbol(service.prices?.[0]?.currency) : "" }
                               />
                        )
                    })
                }
                </span>
                <a href="/user/laundroclean-services#all-services" className={styles.seeallbutton}>See all</a>
            </section>
            <section className={styles.activeorderssection}>
                <span className={styles.sectionheader}><b>Active Orders</b></span>
                <section className={styles.activeordersdisplaybox}>
                    <ActiveOrder />
                </section>
                
                {/* Active Orders/Order status: Orders that are not yet delivered but confirmed (paid) */}
                <a href="" className={styles.seeallbutton}>See all</a>
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