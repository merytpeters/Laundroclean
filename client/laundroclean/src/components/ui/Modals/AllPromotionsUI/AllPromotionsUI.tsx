import { PromoCodeDto } from 'src/types/laundrocleanServices/promoCode.dto';
import styles from './AllPromotions.module.css';
import { CompanyUser, Client } from 'src/types/users/user';
import { formatDateTime } from 'src/utils/globalTimezone';
import { FaPen } from 'react-icons/fa';
import { useState } from 'react';
import { FaX } from 'react-icons/fa6';
import { useDeactivatePromoCode, useDeletePromoCodes, useReactivatePromoCode } from 'src/hooks/promoCodes/usePromoCode';
import Button from '../../Button/Button';
import { toast } from 'sonner';


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
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [selectedPromoIds, setSelectedPromoIds] = useState<string[]>([]);
    const softDeleteMutation = useDeactivatePromoCode();
    const hardDeleteMutation = useDeletePromoCodes();
    const reactivationMutation = useReactivatePromoCode();

    // setSelectedPromoIds((prev) => [...prev, item])
    const handleCheckboxChange = (
        item: string,
        checked: boolean,
    ) => {
        setSelectedPromoIds((prev) =>
            checked
                ? prev.includes(item)
                    ? prev
                    : [...prev, item]
                : prev.filter((selected) => selected !== item)
        )
    }

    const handlehardDelete = async (values: string[]) => {
        hardDeleteMutation.mutate(values)
    }

    const handleDeactivation = async (value: string) => {
        softDeleteMutation.mutate(value)
    }

    const handleReactivation = async (value: string) => {
        reactivationMutation.mutate(value)
    }

    console.log("Selected Promo Items:", selectedPromoIds)

    return (
        <section className={styles.promotionslistcardcontainer}>
            {!isEditing ? (
                <span className={styles.promotionslistcardcontainer}>
                    <FaPen className={styles.fapen} onClick={() => setIsEditing(true)} />
                    {promoList?.map((promoDetails) => (
                        <span key={promoDetails.id} className={styles.promolistrow}>
                            <span className={styles.promolistitem}><b>Code: {promoDetails.code}</b></span>
                            <span className={styles.promolistitem}><b>Description: {promoDetails.description}</b></span>
                            <span className={styles.promolistitem}><b>Service: {promoDetails.service?.name}</b></span>
                            <span className={styles.promolistitem}><b>Promo Type: {promoDetails.type}</b></span>
                            <span className={styles.promolistitem}><b>Value currency: {promoDetails.currency?.toLowerCase()}</b></span>
                            <span className={styles.promolistitem}><b>Starts at: {formatDateTime(promoDetails.startsAt)}</b></span>
                            <span className={styles.promolistitem}><b>Valid till: {formatDateTime(promoDetails.expiresAt)}</b></span>
                            <span className={styles.promolistitem}><b>Your usage limit: {promoDetails.perUserLimit}</b></span>
                            {isClient && (<span className={styles.promolistitem}><b>Number of times used by you: {promoDetails.promoUsages?.[0].timesUsed}</b></span>)}

                            {isCompanyUser && (
                                <span className={styles.promocompanyitem}>
                                    <span className={styles.promolistitem}><b>Status:  </b>
                                        {promoDetails.isActive ? (
                                            <button className={styles.activebtn} onClick={() => handleDeactivation(promoDetails.id)}>active</button>
                                        ) : (
                                            <button className={styles.inactivebtn} onClick={() => handleReactivation(promoDetails.id)}>inactive</button>
                                        )}
                                    </span>
                                    <span className={styles.promototalusage}>
                                        <span><b>Total Usage Limit: {promoDetails.usageLimit} </b></span> {/** This need attention and check */}
                                        <span><b>Total times Used: {promoDetails.timesUsed}</b></span>
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
                </span>
            ) : (
                <span className={styles.promotionslistcardcontainer}>
                    {/** expan on this next */}
                    <Button text="Permanent Delete" onClick={() => toast.warning("This action is permanent and deletes all usage analysis data on this promocode")}/><FaX className={styles.fapen} onClick={() => setIsEditing(false)} />
                    {promoList?.map((promoDetails) => (
                        <span key={promoDetails.id} className={styles.promolistrow}>
                            <input type="checkbox" checked={selectedPromoIds?.includes(
                                promoDetails.id
                            )} onChange={(e) => handleCheckboxChange(promoDetails.id, e.target.checked)} />
                            <span className={styles.promolistitem}><b>Code: {promoDetails.code}</b></span>
                            <span className={styles.promolistitem}><b>Description: {promoDetails.description}</b></span>
                            <span className={styles.promolistitem}><b>Service: {promoDetails.service?.name}</b></span>
                            <span className={styles.promolistitem}><b>Promo Type: {promoDetails.type}</b></span>
                            <span className={styles.promolistitem}><b>Value currency: {promoDetails.currency?.toLowerCase()}</b></span>
                            <span className={styles.promolistitem}><b>Starts at: {formatDateTime(promoDetails.startsAt)}</b></span>
                            <span className={styles.promolistitem}><b>Valid till: {formatDateTime(promoDetails.expiresAt)}</b></span>
                            <span className={styles.promolistitem}><b>Your usage limit: {promoDetails.perUserLimit}</b></span>
                            {isClient && (<span className={styles.promolistitem}><b>Number of times used by you: {promoDetails.promoUsages?.[0].timesUsed}</b></span>)}
                            {isCompanyUser && (
                                <span className={styles.promocompanyitem}>
                                    <span className={styles.promolistitem}><b>Status:  </b>
                                        {promoDetails.isActive ? (
                                            <button className={styles.activebtn} onClick={() => handleDeactivation(promoDetails.id)}>active</button>
                                        ) : (
                                            <button className={styles.inactivebtn} onClick={() => handleReactivation(promoDetails.id)}>inactive</button>
                                        )}
                                    </span>
                                    <span className={styles.promototalusage}>
                                        <span><b>Total Usage Limit: {promoDetails.usageLimit} </b></span> {/** This need attention and check */}
                                        <span><b>Total times Used: {promoDetails.timesUsed}</b></span>
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
                </span>
            )}

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
                {validPromoList?.length !== 0 ? (
                    <PromotionsListCard user={user} promoList={validPromoList} />
                ) : (
                    <span><i>Valid promotions will be displayed here</i></span>
                )}

            </section>

            {isCompanyUser && (
                <span>

                    <span>
                        <h4>Expired offers</h4>
                        {expiredPromoList?.length !== 0 ? (
                            <PromotionsListCard user={user} promoList={expiredPromoList} />
                        ) : (
                            <span><i>Expired offers will how here</i></span>
                        )}

                    </span>

                    <span>
                        <h4>Inactive offers</h4>
                        {inactivePromoList?.length !== 0 ? (
                            <PromotionsListCard user={user} promoList={inactivePromoList} />
                        ) : (
                            <span><i>All inactive offers will be displayed here</i></span>
                        )}
                    </span>

                </span>

            )}
        </section>
    )
}