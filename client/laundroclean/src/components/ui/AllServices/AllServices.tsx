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
type MapView = LocationViewType | null;

function ServiceArea() {
    return (
        <div>
            <form action="">
                form for adding service area
            </form>
        </div>
    )
}

function DropOffPoints() {
    return(
        <div>
            <form action=""> Form for adding drop off point</form>
        </div>
    )
}

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
            Detailed Services List
        </div>
    )
}

export default function AllServices(props: AllServicesProps ) {
    const [activeLocationView, setActiveLocationView] = useState<LocationViewType>("serviceAreas");

    const [activeMapView, setActiveMapView] = useState<MapView>("serviceAreas");

    return (
        <div className={styles.allservicescontainer}>AllServices
            {props.companyuser && <section>
                CompanyUserView Only

                <ServiceArea />
                <DropOffPoints />

                <ServicePrice />

            </section>}

            <section>
                <div className={styles.locationSection}>
                    <h2>Location Management</h2>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleButton} ${
                                activeLocationView === "serviceAreas"
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => setActiveLocationView("serviceAreas")}
                        >
                            Service Areas
                        </button>

                        <button
                            className={`${styles.toggleButton} ${
                                activeLocationView === "dropoffPoints"
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => setActiveLocationView("dropoffPoints")}
                        >
                            Drop-Off Locations
                        </button>
                    </div>

                    {/* MAP AREA (NO REMOUNT GLITCH FIX) */}
                    <div className={styles.locationContent}>
                        {activeMapView ? (
                            <>
                                {activeLocationView === "serviceAreas" && (
                                    <ServiceAreaLocation
                                        onClose={() => setActiveMapView(null)}
                                    />
                                )}

                                {activeLocationView === "dropoffPoints" && (
                                    <DropOffLocation
                                        onClose={() => setActiveMapView(null)}
                                    />
                                )}
                            </>
                        ) : (
                            <button
                                onClick={() => setActiveMapView(activeLocationView)}
                                className={styles.reopenButton}
                            >
                                Reopen Map
                            </button>
                        )}
                    </div>
                    
                </div>
                <ServicesList />
            </section>
        </div>
    )
}