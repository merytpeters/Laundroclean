"use client";

import AllServices from "src/components/ui/AllServices/AllServices";
import styles from "./laundroclean-services.module.css";
import { useAuth } from "src/context/AuthContext";

export default function LaundroCleanServices () {
    const { authUser } = useAuth();

    if (!authUser) {
        throw new Error("User not authenticated")
    }

    if (authUser.type === "CLIENT") {
        return null
    }

    return (
        <div className={styles.servicescontainer}>
            <AllServices
              companyuser={authUser}
            />
        </div>
    )
}