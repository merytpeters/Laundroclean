"use client";

import Button from "src/components/ui/Button/Button";
import styles from "./Promotions.module.css";
import AllPromotionsUI from "../../AllPromotionsUI/AllPromotionsUI";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import { useAuth } from "src/context/AuthContext";
import { useState } from "react";
import CreateNewPromo from "src/components/ui/Forms/PromotionForm";
import { usePromoCodes } from "src/hooks/promoCodes/usePromoCode";
import { useServices } from "src/hooks/laundroCleanServices/useServices";


export default function CompanyUserPromotionsUI() {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const { data: servicesRes} = useServices({});
    const services = Array.isArray(servicesRes?.data)
        ? servicesRes.data
        : [];
    const { data } = usePromoCodes();
    const promoCodes = Array.isArray(data?.data)
        ? data.data
        : [];

    const { authUser, isLoading, refetch, isError } = useAuth();

    if (isLoading) {
        return (
            <LoadingState />
        )
    }

    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        );
    }

    if (!authUser || authUser.type !== "COMPANYUSER") {
        return null;
    }
    return (
        <section className={styles.promoContainer}>

            <span className={styles.promoheader}>
                <h3>All Offers & Promotions</h3>
                {!isFormOpen && (
                    <Button text={promoCodes.length === 0 ? "Create First PromoCode": "Create New Promos"} className={styles.newpromobtn} onClick={() => setIsFormOpen(true)}/>
                )}
                {isFormOpen && (
                    <div>
                        <span className={styles.overlay}></span>
                        <CreateNewPromo data={promoCodes} services={services} onClose={() => setIsFormOpen(false)}/>
                    </div>
                )}
            </span>
            <AllPromotionsUI user={authUser} />
        </section>
    )
}