"use client";

import { useState } from "react";
import styles from "./AllServices.module.css";
import { CompanyUser, Client } from "src/types/user";
import ServiceAreaLocation from "./ServiceAreaLocation";
import DropOffLocation from "./DropOffLocation";

interface AllServicesProps {
    companyuser?: CompanyUser;
    clientuser?: Client;
}

type LocationViewType = "serviceAreas" | "dropoffPoints";

function ServicePrice() {
    return (
        <div>
            ServicePrice Edit
        </div>
    )
}

function ServicesList() {
    return (
        <div>
            Services List
        </div>
    )
}

export default function AllServices(props: AllServicesProps ) {
    const [activeLocationView, setActiveLocationView] = useState<LocationViewType>("serviceAreas");

    return (
        <div className={styles.allservicescontainer}>AllServices
            {props.companyuser && <section>
                CompanyUserView Only

                <div className={styles.locationSection}>
                    <h2>Location Management</h2>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleButton} ${activeLocationView === "serviceAreas" ? styles.active : ""}`}
                            onClick={() => setActiveLocationView("serviceAreas")}
                        >
                            Service Areas
                        </button>
                        <button
                            className={`${styles.toggleButton} ${activeLocationView === "dropoffPoints" ? styles.active : ""}`}
                            onClick={() => setActiveLocationView("dropoffPoints")}
                        >
                            Drop-Off Locations
                        </button>
                    </div>

                    <div className={styles.locationContent}>
                        {activeLocationView === "serviceAreas" && <ServiceAreaLocation />}
                        {activeLocationView === "dropoffPoints" && <DropOffLocation />}
                    </div>
                </div>

                <ServicePrice />

            </section>}

            <section>
                <ServicesList />
            </section>
        </div>
    )
}