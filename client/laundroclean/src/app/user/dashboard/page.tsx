import {DashboardServices } from "src/components/ui/flexboxes/ServicesFlexbox";
import styles from "./dashboard.module.css";
import { mapCurrencySymbol, mapPricingType } from "src/types/laundroservices";
import { mockServices } from "src/services/laundrocleanservices/mock";

export default function ClientDashboard () {
    const services = mockServices;
    const mappedServiceFields = services.map((item) => {
        let currency: string;
        let pricingType: string;
        try {
            currency = item.currency ? mapCurrencySymbol(item.currency) : item.currency;
            pricingType = item.pricingType ? mapPricingType(item.pricingType) : item.pricingType;
        } catch {
            return item;
        }
        return {
            ...item,
            currency,
            pricingType,
        };
    })
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
                <a href="" className={styles.seeallbutton}>See all</a>
            </section>
            <section>
                Active Orders/Order status: Orders that are not yet delivered but confirmed (paid)
            </section>
            <section>
                Promos
            </section>
        </div>
    )
}