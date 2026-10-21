import { PromoCodeDto } from 'src/types/laundrocleanServices/promoCode.dto';
import styles from './AllPromotions.module.css';
import { CompanyUser, Client } from 'src/types/users/user';
import { formatDateTime } from 'src/utils/globalTimezone';


interface AllPromotionsUIProps {
    user: CompanyUser | Client;
    validPromoList?: PromoCodeDto[];
    expiredPromoList?: PromoCodeDto[];
    inactivePromoList?: PromoCodeDto[];
    promoList?: PromoCodeDto[];
}


export function PromotionsListCard({ user, promoList }: AllPromotionsUIProps) {
    const isCompanyUser = user.type === "COMPANYUSER";
    const isClient = user.type === "CLIENT";

    return (
        <section className={styles.promotionslistcardcontainer}>
            {promoList?.map((promoDetails) => (
                <span key={promoDetails.id} className={styles.promolistrow}>
                    <span className={styles.promolistitem}><b>Code: {promoDetails.code}</b></span>
                    <span className={styles.promolistitem}><b>Description: {promoDetails.description}</b></span>
                    <span className={styles.promolistitem}><b>Service: {promoDetails.service.name}</b></span>
                    <span className={styles.promolistitem}><b>Promo Type: {promoDetails.type}</b></span>
                    <span className={styles.promolistitem}><b>Value currency: {promoDetails.currency?.toLowerCase()}</b></span>
                    <span className={styles.promolistitem}><b>Starts at: {formatDateTime(promoDetails.startsAt)}</b></span>
                    <span className={styles.promolistitem}><b>Valid till: {formatDateTime(promoDetails.expiresAt)}</b></span>
                    <span className={styles.promolistitem}><b>Your usage limit: {promoDetails.perUserLimit}</b></span>
                    {isClient && (<span className={styles.promolistitem}><b>Number of times used by you: {promoDetails.promoUsages?.[0].timesUsed}</b></span>)}
                    <span className={styles.promolistitem}><b>Active: </b></span>
                    {isCompanyUser && (
                        <span className={styles.promocompanyitem}>
                            <span className={styles.promototalusage}>
                                <span><b>Total Usage Limit: {promoDetails.usageLimit} </b></span> {/** This need attention and check */}
                                <span><b>Total times Used: {promoDetails.timesUsed}</b></span>
                                <span><b>Inactive</b></span>
                            </span>

                            <span className={styles.promotimestamp}>
                                <b>Timestamps</b>
                                <span><b>Created at: {formatDateTime(promoDetails.createdAt)}</b></span>
                                <span><b>Updated at: {formatDateTime(promoDetails.updatedAt)}</b></span>
                                <span><b>Deleted at: {formatDateTime(promoDetails.deletedAt)}</b></span>
                            </span>
                        </span>
                    )}
                </span>
            ))}

        </section>
    )
}

export default function AllPromotionsUI({ user, validPromoList, inactivePromoList, expiredPromoList }: AllPromotionsUIProps) {
    const isCompanyUser = user.type === "COMPANYUSER";

    return (
        <section className={styles.allPromoConatiner}>
            <section className={styles.validpromocontainer}>
                {/** active promo codes only */}
                <h4>Valid Offers</h4>
                <PromotionsListCard user={user} promoList={validPromoList} />
            </section>

            {isCompanyUser && (
                <span>

                    <span>
                        <h4>Expired offers</h4>
                        <PromotionsListCard user={user} promoList={expiredPromoList} />
                    </span>

                    <span>
                        <h4>Inactive offers</h4>
                        <PromotionsListCard user={user} inactivePromoList={inactivePromoList} />
                    </span>

                </span>

            )}
        </section>
    )
}