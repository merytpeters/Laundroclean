import StatCard from "src/components/ui/flexboxes/StatCard";
import { stats } from "../../../../../services/bookingService/bookingMockData";
import { roleConfig } from "src/lib/company-user/role-config";
import styles from "./DeliveryModal.module.css"
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { DeliveryStatMeta } from "src/components/ui/StatMeta";

export default function DeliveryModal () {
    const { user } = useCompanyUserMenu();
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