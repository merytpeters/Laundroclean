"use client";

import AllPromotionsUI from "src/components/ui/Modals/AllPromotionsUI/AllPromotionsUI";
import styles from './promotions.module.css';
import { useAuth } from "src/context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";

export default function ClientPromoView() {
    const { authUser, isLoading, isError, refetch } = useAuth();

    if (isLoading) return <FaSpinner />;
    if (isError) {
        return (
            <ErrorState
                message="Failed to load your profile."
                onRetry={refetch}
            />
        )
    }

    if (!authUser) {
        return null;
    }
    return (
        <section className={styles.clientPromoContainer}>
            <AllPromotionsUI user={authUser} />
        </section>
    )
}