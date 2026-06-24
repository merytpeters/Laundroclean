import {DashboardServices } from "src/components/ui/flexboxes/ServicesFlexbox";
import styles from "./dashboard.module.css";
import { mapCurrencySymbol, mapPricingType } from "src/types/laundroservices";
import { mockServices } from "src/services/laundrocleanservices/mock";
import ActiveOrder from "src/components/ui/flexboxes/ActiveOrder";
import PromoCard from "src/components/ui/flexboxes/PromoCard";
import { transformFieldInArray } from "src/utils/mapData";

export default function ClientDashboard () {
    const currencyMappedData = transformFieldInArray(mockServices, "currency", mapCurrencySymbol)
    const mappedServiceFields = transformFieldInArray(currencyMappedData, "pricingType", mapPricingType)

    return (
        <div className={styles.clientdashboardcontainer}>
            <section aria-describedby="laundrocleanservices display" className={styles.servicesdisplaysection}>
                <span className={styles.displaytext}><b> <i>Here&apos;s</i> our Laundry Services.</b></span>
                <span className={styles.servicesdisplaybox}>
                    { mappedServiceFields?.map((service) => {
                        return (
                            <DashboardServices
                               key={service.id}
                               name={service.name}
                               description={service?.description}
                               pricingType={service.pricingType}
                               amount={service.amount}
                               currency={service.currency}
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