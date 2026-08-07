"use client";

import { useEffect, useState } from "react";
import styles from "./AllServices.module.css";
import { CompanyUser, Client } from "src/types/users/user";
import ServiceAreaLocation from "./ServiceAreaLocation";
import DropOffLocation from "./DropOffLocation";
import Button from "../Button/Button";
import { mapCurrencySymbol, mapPricingType, ServicePayload, ServicePricePayload } from "src/types/laundrocleanServices/laundroservices";
import { useCreateService, useServices } from "src/hooks/laundroCleanServices/useServices";
import { useForm } from "react-hook-form";
import ErrorState, { LoadingState } from "../ErrorState/ErrorState";
// import Pagination from "../Pagination";


interface AllServicesProps {
    companyuser?: CompanyUser;
    clientuser?: Client;
    user?: CompanyUser | Client;
    isActive?: boolean;
}

type LocationViewType = "serviceAreas" | "dropoffPoints";
type MapView = LocationViewType | null;

function ServiceManager() {
    const { data } = useServices({
        params: {
            page: 1,
            limit: 10
        }
    })
    const services = data?.data ?? [];
    const createServiceMutation = useCreateService();
    const headerText = "Add Your First Service";

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    type FormValues = ServicePayload & {
        servicePrice?: ServicePricePayload;
    }
    const formData = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: "",
            maxDailyBookings: undefined,
            servicePrice: {
                amount: undefined,
                currency: undefined,
                pricingType: undefined,
            },
        }
    })

    const handleCreateService = (values: FormValues) => {
        console.log(values);
        createServiceMutation.mutate({
            service: {
                name: values.name,
                description: values.description,
                maxDailyBookings: values.maxDailyBookings,
            },
            servicePrice: {
                serviceId: values.servicePrice?.serviceId,
                amount: values.servicePrice?.amount,
                currency: values.servicePrice?.currency,
                pricingType: values.servicePrice?.pricingType
            },
        },
            {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
            });
    }

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
                    <form onSubmit={formData.handleSubmit(handleCreateService)}>
                        <h4>{services.length === 0 ? headerText : "Add a New Service"}</h4>
                        <legend><b>Create a new service, set price and maximum daily bookings</b> </legend>
                        <span className={styles.formgroup}>
                            <span className={styles.formitem}>
                                <label htmlFor="name">Service name</label>
                                <input type="text" id="name" {...formData.register("name")} />
                            </span>


                            <span className={styles.formitem}>
                                <label htmlFor="description">Description</label>
                                <input type="text" id="description" {...formData.register("description")} />
                            </span>

                        </span>
                        <span className={styles.formgroup}>
                            <span className={styles.formitem}>
                                <label htmlFor="maxDailyBookings">Maximum Daily Bookings </label>
                                <input type="number" id="maxDailyBookings" {...formData.register("maxDailyBookings", { valueAsNumber: true, })} />
                            </span>


                            <span className={styles.formitem}>
                                <label htmlFor="pricingType">Pricing Type</label>
                                <select id="pricingType" {...formData.register("servicePrice.pricingType")}>
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
                                <select id="currency" {...formData.register("servicePrice.currency")}>
                                    <option value="" disabled>Please choose currency</option>
                                    <option value="NAIRA">₦</option>
                                    <option value="DOLLAR">$</option>
                                    <option value="POUNDS">£</option>
                                </select>
                            </span>


                            <span className={styles.formitem}>
                                <label htmlFor="amount">Amount</label>
                                <input type="number" id="amount" {...formData.register("servicePrice.amount", { valueAsNumber: true, })} />
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

function ServicesList({ user, isActive  = true}: AllServicesProps) {
    // const [isOpenOverlay, setIsOpenOverlay] = useState(false);
    const { data, isLoading, error, refetch } = useServices({
        params: {
            page: 1,
            limit: 10
        }
    })
    const services = data?.data ?? [];
    useEffect(() => {
        if (!services) return;

        const hash = window.location.hash;
        if (!hash) return;

        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: "smooth"})
    })
    if (isLoading) {
        return (
            <LoadingState />
        )
    }

    if (error) {
        return (
            <ErrorState
                message="Failed to services."
                onRetry={refetch}
            />
        );
    }
    
    const filteredServices = services.filter(
        (service) => service.isActive === isActive
    );
    const isCompanyUser = user?.type === "COMPANYUSER";

    return (
        <div className={styles.serviceslist}>
            {filteredServices.map((service) => (
                <span key={service.id} className={styles.servicelistrow} id={service.name.toLowerCase().replace(/\s+/g, "-")}>
                    <span><b>Name</b>: {service.name}</span>
                    <span><b>Description</b>: {service.description}</span>
                    <span><b>Price</b>: {service.prices?.[0] &&
                        mapCurrencySymbol(service.prices?.[0]?.currency)}
                        {service.prices?.[0]?.amount}</span>
                    <span><b>Pricing type</b>: {service.prices?.[0] &&
                        mapPricingType(service.prices?.[0]?.pricingType)}</span>
                    <span><b>Promocodes</b>:  {service.promoCodes?.map((promo) => promo.code).join(", ")}
                    </span>
                    {isCompanyUser && (
                        <span className={styles.companviewserviceitems}>
                            <span><b>Maximum daily bookings</b>: {service.maxDailyBookings}</span>
                            <span className={styles.servicestimestamp}>
                                <b>Timestamps</b>
                                <span><b>Created at:</b> {service.createdAt}</span>
                                <span>
                                    {service.updatedAt && (<span><b>Updated at</b>: {service.updatedAt}</span>)}
                                </span> 
                                <span>
                                    {service.deletedAt && (<span><b>Deleted at</b>: {service.deletedAt}</span>)}
                                </span> 
                            </span>
                        </span>
                    )}
                </span>
            ))}
        </div>
    )
}

export default function AllServices(props: AllServicesProps) {
    const [activeLocationView, setActiveLocationView] = useState<LocationViewType>("serviceAreas");

    const [activeMapView, setActiveMapView] = useState<MapView | null>(null);
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
                                        usertype={props.companyuser || props.clientuser}
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
            <section id="all-services" className={styles.serviceslistsection}>
                {props.companyuser && (
                    <span className={styles.allServicesHeader}>
                        <h4>All Services</h4>
                    <ServiceManager />
                    </span>     
                )}
                <h4>Active Services</h4>
                <ServicesList user={props.companyuser || props.clientuser} />
                {/*<Pagination totalPages={totalPages}/>*/}
                {props.companyuser && (
                    <section>
                        <h4>Inactive Services</h4>
                        <ServicesList user={props.companyuser} isActive={false}/>
                    </section>
                )}

            </section>
        </div>
    )
}