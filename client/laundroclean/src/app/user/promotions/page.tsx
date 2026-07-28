import AllPromotionsUI from "src/components/ui/Modals/AllPromotionsUI/AllPromotionsUI";
import styles from './promotions.module.css'

export default function ClientPromoView () {
    return (
        <section className={styles.clientPromoContainer}>
            Client PromoView
            <AllPromotionsUI />
        </section>
    )
}