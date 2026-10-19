"use client";

import AllServices from "src/components/ui/AllServices/AllServices";
import styles from "./ServicesModal.module.css";
import { useAuth } from "src/context/AuthContext";

export default function StaffServicesModal() {

    const { authUser } = useAuth();

    if (!authUser) {
        throw new Error("User not authenticated")
    }

    if (authUser.type === "CLIENT") {
        return null
    }
    return (
        <div className={styles.servicesmodalcontainer}>
            <AllServices
                companyuser={authUser}
            />
        </div>
    )
}