import styles from './promotions.module.css';
import CompanyUserPromotionsUI from 'src/components/ui/Modals/CompanyUser/Promotions/Promotions';

export default function Promotions () {
    return (
        <section className={styles.promotionsContainer}>

            <CompanyUserPromotionsUI />
        </section>
    )
}