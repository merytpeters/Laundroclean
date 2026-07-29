import AllPromotionsUI from "src/components/ui/Modals/AllPromotionsUI/AllPromotionsUI";
import styles from './promotions.module.css';
import { mockClient } from "src/services/clientuser/mock";

export default function ClientPromoView () {
    const user = mockClient
    return (
        <section className={styles.clientPromoContainer}>
            <AllPromotionsUI user={user}/>
        </section>
    )
}