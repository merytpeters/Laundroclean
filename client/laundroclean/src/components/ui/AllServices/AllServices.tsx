"use client";

import { useState } from "react";
import styles from "./AllServices.module.css";
import { CompanyUser, Client } from "src/types/user";
import ServiceAreaLocation from "./ServiceAreaLocation";
import DropOffLocation from "./DropOffLocation";
import Button from "../Button/Button";
import { ServiceDisplayProp } from "src/services/laundrocleanservices/laundrocleanservices.service";
import { DropoffPoint } from "src/hooks/locations/useDropoffPoints";

interface AllServicesProps {
    companyuser?: CompanyUser;
    clientuser?: Client;
}

type LocationViewType = "serviceAreas" | "dropoffPoints";
type MapView = LocationViewType | null;


{/** This will be done to pick radius on the map */ }
{/*function ServiceArea() {
    return (
        <div>
            <form action="">
                form for adding service area
            </form>
        </div>
    )
}*/}

function DropOffPoints() {
    const [dropoffPoints] = useState<DropoffPoint[]>([]);
    const headerText = "Add Your First Drop off location";

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    return (
        <div className={styles.servicemanager}>
            <h3>{dropoffPoints.length === 0 ? headerText : "Add a New Drop off Location"}</h3>
            <span><b>Create a new drop off point, an address where clients can go drop their laundry for collective pick up</b></span>
            {!isFormOpen && (
              <Button
                text={dropoffPoints.length === 0 ? "Create First Drop off point" : "Create Drop off point"}
                onClick={() => setIsFormOpen(true)}
                className={styles.addservicebtn}
              />
            )}
            {isFormOpen && (
                <form action="">
                    <span className={styles.formgroup}>
                        <span className={styles.formitem}>
                            <label htmlFor="name">Drop off location name</label>
                            <input type="text" id="name"/>
                        </span>


                        <span className={styles.formitem}>
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address"/>
                        </span>
                    </span>
                    <span className={styles.actionbuttons}>
                        <Button type="button" text="cancel" onClick={() => setIsFormOpen(false)} className={styles.cancelbutton}/>
                        <Button text="save" type="submit" className={styles.savebtn}/>
                    </span>

                </form>
            )}
        </div>
    )
}

function ServiceManager() {
    const [services] = useState<ServiceDisplayProp[]>([]);
    const headerText = "Add Your First Service";

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    return (
        <div className={styles.servicemanager}>
            <h3>{services.length === 0 ? headerText : "Add a New Service"}</h3>
            <span><b>Create a new service, set price and maximum daily bookings</b></span>
            {!isFormOpen && (
              <Button
                text={services.length === 0 ? "Create First Laundroclean Service" : "Create Service"}
                onClick={() => setIsFormOpen(true)}
                className={styles.addservicebtn}
            />
            )}
            {isFormOpen && (
                <form action="">
                    <span className={styles.formgroup}>
                        <span className={styles.formitem}>
                            <label htmlFor="name">Service name</label>
                            <input type="text" id="name" />
                        </span>


                        <span className={styles.formitem}>
                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" />
                        </span>

                    </span>
                    <span className={styles.formgroup}>
                        <span className={styles.formitem}>
                            <label htmlFor="maxDailyBookings">Maximum Daily Bookings </label>
                            <input type="number" id="maxDailyBookings"/>
                        </span>


                        <span className={styles.formitem}>
                            <label htmlFor="pricingType">Pricing Type</label>
                            <select name="" id="pricingType">
                                <option value="" disabled>--Please choose an option--</option>
                                <option value="PER_KG">per kg</option>
                                <option value="PER_ITEM">per item</option>
                                <option value="FLAT_RATE">flat rate</option>
                            </select>
                        </span>

                    </span>
                    <span className={styles.formgroup}>
                        <span className={styles.formitem}>
                            <label htmlFor="currency">Currency</label>
                            <select name="" id="currency">
                                <option value="" disabled>Please choose currency</option>
                                <option value="NAIRA">₦</option>
                                <option value="DOLLAR">$</option>
                                <option value="POUNDS">£</option>
                            </select>
                        </span>


                        <span className={styles.formitem}>
                            <label htmlFor="amount">Amount</label>
                            <input type="text" id="amount"/>
                        </span>

                    </span>
                    <span className={styles.actionbuttons}>
                        <Button type="button" text="cancel" onClick={() => setIsFormOpen(false)} className={styles.cancelbutton}/>
                        <Button text="save" type="submit" className={styles.savebtn}/>
                    </span>

                </form>
            )}
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

export default function AllServices(props: AllServicesProps) {
    const [activeLocationView, setActiveLocationView] = useState<LocationViewType>("serviceAreas");

    const [activeMapView, setActiveMapView] = useState<MapView>("serviceAreas");

    return (
        <div className={styles.allservicescontainer}>
            {props.companyuser && <section className={styles.servicemanagersection}>
                {/* CompanyUserView Only */}
                <div className={`${styles.blob} ${styles['blob-1']}`}></div>
                <div className={`${styles.blob} ${styles['blob-2']}`}></div>
                <div className={`${styles.blob} ${styles['blob-3']}`}></div>

                <ServiceManager />

                {/*<ServiceArea />*/}
                <DropOffPoints />

            </section>}

            <section className={styles.locationManager}>
                <div className={styles.locationSection}>
                    <h2>Location Management</h2>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleButton} ${activeLocationView === "serviceAreas"
                                ? styles.active
                                : ""
                                }`}
                            onClick={() => setActiveLocationView("serviceAreas")}
                        >
                            Service Areas
                        </button>

                        <button
                            className={`${styles.toggleButton} ${activeLocationView === "dropoffPoints"
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

            </section>
            <section id="all-services">
                <ServicesList />
            </section>
        </div>
    )
}