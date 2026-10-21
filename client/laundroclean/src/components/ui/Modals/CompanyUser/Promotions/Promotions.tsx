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
    const { data: servicesRes } = useServices({});
    const services = Array.isArray(servicesRes?.data)
        ? servicesRes.data
        : [];
    const { data } = usePromoCodes();
    const promoCodes = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];
    const inactivePromoList = promoCodes.filter((promoCode) => (promoCode.isActive === false));
    const expiredPromoList = promoCodes.filter((promoCode) => {
        const now = new Date();
        const expiresAt = new Date(promoCode.expiresAt)
        return (
            now >= expiresAt
        )
    });
    const validPromoList = promoCodes.filter((promoCode) => {
        const now = new Date();
        const expiresAt = new Date(promoCode.expiresAt);
        // not expired and active
        if (expiresAt > now) return promoCode.isActive
    });

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

    console.log("Promo data:", data)
    console.log("promocodes:", promoCodes)
    console.log("Expired promo:", expiredPromoList)
    console.log("Valid promo:", validPromoList)

    if (!authUser || authUser.type !== "COMPANYUSER") {
        return null;
    }
    return (
        <section className={styles.promoContainer}>

            <span className={styles.promoheader}>
                <h3>All Offers & Promotions</h3>
                {!isFormOpen && (
                    <Button text={promoCodes.length === 0 ? "Create First PromoCode" : "Create New Promos"} className={styles.newpromobtn} onClick={() => setIsFormOpen(true)} />
                )}
                {isFormOpen && (
                    <div>
                        <span className={styles.overlay}></span>
                        <CreateNewPromo data={promoCodes} services={services} onClose={() => setIsFormOpen(false)} />
                    </div>
                )}
            </span>
            <AllPromotionsUI user={authUser} inactivePromoList={inactivePromoList} expiredPromoList={expiredPromoList} validPromoList={validPromoList} />
        </section>
    )
}