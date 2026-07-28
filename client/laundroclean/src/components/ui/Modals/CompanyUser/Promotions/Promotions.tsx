import Button from "src/components/ui/Button/Button";
import styles from "./Promotions.module.css";
import AllPromotionsUI from "../../AllPromotionsUI/AllPromotionsUI";


export default function CompanyUserPromotionsUI () {
    return (
        <section className={styles.promoContainer}>
            <Button text="Create New Promos" className={styles.newpromobtn}/>

            <AllPromotionsUI />
        </section>
    )
}