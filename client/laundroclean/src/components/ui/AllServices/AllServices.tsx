"use client";

import { useState } from "react";
import styles from "./AllServices.module.css";
import { CompanyUser, Client } from "src/types/users/user";
import ServiceAreaLocation from "./ServiceAreaLocation";
import DropOffLocation from "./DropOffLocation";
import Button from "../Button/Button";
import { ServiceDisplayProp } from "src/types/laundrocleanServices/laundroservices";
import { DropoffPoint } from "src/hooks/locations/useDropoffPoints";
// import Pagination from "../Pagination";


interface AllServicesProps {
    companyuser?: CompanyUser;
    clientuser?: Client;
    user?: CompanyUser | Client;
}

type LocationViewType = "serviceAreas" | "dropoffPoints";
type MapView = LocationViewType | null;


function DropOffPoints() {
    const [dropoffPoints] = useState<DropoffPoint[]>([]);
    const headerText = "Add Your First Drop off location";

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    return (
        <div className={styles.servicemanager}>
            {!isFormOpen && (
                <Button
                    text={dropoffPoints.length === 0 ? "Create First Drop off point" : "Create Drop off point"}
                    onClick={() => setIsFormOpen(true)}
                    className={styles.addservicebtn}
                />
            )}
            {isFormOpen && (
                <div>
                    <span className={styles.overlay}></span>
                    <form action="">
                        <h4>{dropoffPoints.length === 0 ? headerText : "Add a New Drop off Location"}</h4>
                        <legend><b>Create a new drop off point, an address where clients can drop their laundry for collective pick up</b></legend>
                        <span className={styles.formgroup}>
                            <span className={styles.formitem}>
                                <label htmlFor="name">Drop off location name</label>
                                <input type="text" id="name" />
                            </span>


                            <span className={styles.formitem}>
                                <label htmlFor="address">Address</label>
                                <input type="text" id="address" />
                            </span>
                        </span>
                        <span className={styles.actionbuttons}>
                            <Button type="button" text="cancel" onClick={() => setIsFormOpen(false)} className={styles.cancelbutton} />
                            <Button text="save" type="submit" className={styles.savebtn} />
                        </span>

                    </form>
                </div>
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

            {!isFormOpen && (
                <Button
                    text={services.length === 0 ? "Create First Laundroclean Service" : "Create Service"}
                    onClick={() => setIsFormOpen(true)}
                    className={styles.addservicebtn}
                />
            )}
            {isFormOpen && (
                <div>
                    <span className={styles.overlay}></span>
                    <form action="">
                        <h4>{services.length === 0 ? headerText : "Add a New Service"}</h4>
                        <legend><b>Create a new service, set price and maximum daily bookings</b> </legend>
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
                                <input type="number" id="maxDailyBookings" />
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
                                <input type="text" id="amount" />
                            </span>

                        </span>
                        <span className={styles.actionbuttons}>
                            <Button type="button" text="cancel" onClick={() => setIsFormOpen(false)} className={styles.cancelbutton} />
                            <Button text="save" type="submit" className={styles.savebtn} />
                        </span>

                    </form>
                </div>
            )}
        </div>
    )
}

function ServicesList({user}: AllServicesProps) {
    // const [isOpenOverlay, setIsOpenOverlay] = useState(false);
    const isCompanyUser = user?.type === "COMPANYUSER";

    return (
        <div className={styles.serviceslist}>
            <span className={styles.servicelistrow}>
                <span><b>name</b></span>
                <span>Description</span>
                <span><b>Price:</b> currency amount</span>
                <span><b>pricingType</b></span>
                <span><b>Promocodes:</b>  clickable link to promocode page</span>
                {isCompanyUser && (
                    <span className={styles.companviewserviceitems}>
                        <span><b>Maximum daily bookings: </b></span>
                        <span className={styles.servicestimestamp}>
                            <b>Timestamps</b>
                            <span><b>Created at:</b></span>
                            <span><b>Updated at</b></span>
                            <span><b>Deleted at:</b></span>
                        </span>
                    </span>
                )}
            </span>
        </div>
    )
}

export default function AllServices(props: AllServicesProps) {
    const [activeLocationView, setActiveLocationView] = useState<LocationViewType>("serviceAreas");

    const [activeMapView, setActiveMapView] = useState<MapView>("serviceAreas");
    // const totalPages = 1;

    return (
        <div className={styles.allservicescontainer}>
            <section className={styles.locationManager}>
                <div className={styles.locationSection}>
                    <h3>Location Management</h3>
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
                                        usertype={props.companyuser || props.clientuser}
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
            {props.companyuser && <section className={styles.servicemanagersection}>
                {/* CompanyUserView Only */}

                <ServiceManager />

                {/*<ServiceArea />*/}
                <DropOffPoints />

            </section>}
            <section id="all-services" className={styles.serviceslistsection}>
                {props.companyuser && (
                    <h4>All Services</h4>
                )}
                <h4>Active Services</h4>
                <ServicesList user={props.companyuser || props.clientuser}/>
                {/*<Pagination totalPages={totalPages}/>*/}
                {props.companyuser && (
                    <section>
                        <h4>Inactive Services</h4>
                        <ServicesList user={props.companyuser}/>
                    </section>
                )}

            </section>
        </div>
    )
}