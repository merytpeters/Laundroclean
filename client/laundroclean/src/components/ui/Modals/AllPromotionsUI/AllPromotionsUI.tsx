import styles from './AllPromotions.module.css';
import { CompanyUser, Client } from 'src/types/users/user';


interface AllPromotionsUIProps {
    user: CompanyUser | Client;
}


export function PromotionsListCard({ user }: AllPromotionsUIProps) {
    const isCompanyUser = user.type === "COMPANYUSER";

    return (
        <section className={styles.promotionslistcardcontainer}>
            <span className={styles.promolistrow}>
                <span className={styles.promolistitem}><b>Code: </b></span>
                <span className={styles.promolistitem}><b>Description:</b></span>
                <span className={styles.promolistitem}><b>Service:</b></span>
                <span className={styles.promolistitem}><b>Promo Type:</b></span>
                <span className={styles.promolistitem}><b>Value currency</b></span>
                <span className={styles.promolistitem}><b>Starts at:</b></span>
                <span className={styles.promolistitem}><b>Valid till:</b></span>
                <span className={styles.promolistitem}><b>Your usage limit:</b></span>
                <span className={styles.promolistitem}><b>Times used:</b></span>
                <span className={styles.promolistitem}><b>Active</b></span>
                {isCompanyUser && (
                    <span className={styles.promocompanyitem}>
                        <span className={styles.promototalusage}>
                            <span><b>Total Usage Limit:</b></span>
                            <span><b>Total times Used</b></span>
                            <span><b>Inactive</b></span>
                        </span>

                        <span className={styles.promotimestamp}>
                            <b>Timestamps</b>
                            <span><b>Created at:</b></span>
                            <span><b>Updated at</b></span>
                            <span><b>Deleted at:</b></span>
                        </span>
                    </span>
                )}
            </span>
        </section>
    )
}

export default function AllPromotionsUI({ user }: AllPromotionsUIProps) {
    const isCompanyUser = user.type === "COMPANYUSER";

    return (
        <section className={styles.allPromoConatiner}>
            <section className={styles.validpromocontainer}>
                {/** active promo codes only */}
                <h4>Valid Offers</h4>
                <PromotionsListCard user={user} />
            </section>

            {isCompanyUser && (
                <span>
                    <h4>Expired offers</h4>
                    <PromotionsListCard user={user} />
                </span>
            )}
        </section>
    )
}