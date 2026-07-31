import Button from "src/components/ui/Button/Button";
import styles from "./Promotions.module.css";
import AllPromotionsUI from "../../AllPromotionsUI/AllPromotionsUI";
import { mockCompanyAdmin, mockCompanyStaff } from "src/services/companyUser/mock";


export default function CompanyUserPromotionsUI () {
    const user = mockCompanyAdmin || mockCompanyStaff
    return (
        <section className={styles.promoContainer}>
            
            <span className={styles.promoheader}>
                <h3>All Offers & Promotions</h3>
                <Button text="Create New Promos" className={styles.newpromobtn}/>
            </span>
            <AllPromotionsUI user={user}/>
        </section>
    )
}