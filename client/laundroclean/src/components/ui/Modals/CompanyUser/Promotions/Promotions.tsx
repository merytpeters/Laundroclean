"use client";

import Button from "src/components/ui/Button/Button";
import styles from "./Promotions.module.css";
import AllPromotionsUI from "../../AllPromotionsUI/AllPromotionsUI";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import { useAuth } from "src/context/AuthContext";


export default function CompanyUserPromotionsUI() {
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
                <Button text="Create New Promos" className={styles.newpromobtn} />
            </span>
            <AllPromotionsUI user={authUser} />
        </section>
    )
}