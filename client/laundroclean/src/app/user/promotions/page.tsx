"use client";

import AllPromotionsUI from "src/components/ui/Modals/AllPromotionsUI/AllPromotionsUI";
import styles from './promotions.module.css';
import { useAuth } from "src/context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import ErrorState from "src/components/ui/ErrorState/ErrorState";
import { usePromoCodes } from "src/hooks/promoCodes/usePromoCode";
import { transformFieldInArray } from "src/utils/mapData";
import { mappedPromoType } from "src/types/laundrocleanServices/promoCode";

export default function ClientPromoView() {
    const { authUser, isLoading, isError, refetch } = useAuth();

    const { data } = usePromoCodes();
    const promoCodes = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];

    const mappedPromoCodes = transformFieldInArray(
        promoCodes,
        "type",
        mappedPromoType
    );

    const validPromoList = mappedPromoCodes.filter((promoCode) => {
        const now = new Date();
        const expiresAt = new Date(promoCode.expiresAt);
        // not expired and active
        if (expiresAt > now) return promoCode.isActive
    });

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
            <AllPromotionsUI user={authUser} validPromoList={validPromoList}/>
        </section>
    )
}