"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AllServices.module.css";
import { CompanyUser, Client } from "src/types/users/user";
import ServiceAreaLocation from "./ServiceAreaLocation";
import DropOffLocation from "./DropOffLocation";
import Button from "../Button/Button";
import { ActivateOrDeactivateServicesPayload, Currency, mapCurrency, mapCurrencySymbol, mapCurrencyType, mapPricingType, PricingTypeValue, ServicePayload, ServicePricePayload } from "src/types/laundrocleanServices/laundroservices";
import { useCreateService, useDeactiveServices, useReactiveServices, useServices, useUpdateService } from "src/hooks/laundroCleanServices/useServices";
import { useForm } from "react-hook-form";
import ErrorState, { LoadingState } from "../ErrorState/ErrorState";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ServiceDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import CurrencySelect from "../PaymentUI/CurrencySelect";
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
        // console.log(values);
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

function ServicesList({ user, isActive = true }: AllServicesProps) {
    const [editingServiceId, setEditingServiceId] = useState<string | null>(
        null
    );

    const [editingCurrency, setEditingCurrency] =
        useState<Record<string, Currency>>({});

    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());

    const spanRef = useRef<
        Record<string, Record<string, HTMLSpanElement | null>>
    >({});

    const inputRef = useRef<
        Record<string, Record<string, HTMLInputElement | HTMLSelectElement | null>>
    >({});

    const updateServiceMutation = useUpdateService();

    const deactivateServiceMutation = useDeactiveServices();
    const reactivateServiceMutation = useReactiveServices();

    const { data, isLoading, error, refetch } = useServices({
        params: {
            page: 1,
            limit: 10,
        },
    });

    const services = data?.data ?? [];

    useEffect(() => {
        const hash = window.location.hash;

        if (!hash) return;

        const element = document.querySelector(hash);

        element?.scrollIntoView({
            behavior: "smooth",
        });
    }, []);

    if (isLoading) {
        return <LoadingState />;
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

    const handleEdit = (
        service: ServiceDto
    ) => {
        const servicePrice =
            service.prices?.[0];

        const currentCurrency =
            servicePrice?.currency;

        /*
         * API:
         * "NAIRA"
         *
         * CurrencySelect:
         * "NGN"
         */
        if (currentCurrency) {
            setEditingCurrency(
                (prev) => ({
                    ...prev,
                    [service.id]:
                        mapCurrency(
                            currentCurrency
                        ),
                })
            );
        }

        setEditingServiceId(
            service.id
        );
    };

    const handleCancel = () => {
        setEditingServiceId(null);

        setEditingCurrency((prev) => {
            const updated = {
                ...prev,
            };

            if (editingServiceId) {
                delete updated[
                    editingServiceId
                ];
            }

            return updated;
        });
    };

    const handleSave = async (
        service: ServiceDto
    ) => {
        const serviceSpans =
            spanRef.current[
            service.id
            ];

        const serviceInputs =
            inputRef.current[
            service.id
            ];

        const servicePrice =
            service.prices?.[0];

        /*
         * -----------------------------
         * NAME
         * -----------------------------
         */
        const name =
            serviceSpans?.name
                ?.innerText
                .trim() ??
            service.name;

        /*
         * -----------------------------
         * DESCRIPTION
         * -----------------------------
         */
        const description =
            serviceSpans?.description
                ?.innerText
                .trim() ??
            service.description;

        /*
         * -----------------------------
         * AMOUNT
         * -----------------------------
         */
        const amount =
            serviceInputs?.amount
                ? Number(
                    serviceInputs
                        .amount
                        .value
                )
                : servicePrice?.amount;

        /*
         * -----------------------------
         * PRICING TYPE
         * -----------------------------
         */
        const pricingType =
            serviceInputs?.pricingType
                ? (
                    serviceInputs
                        .pricingType
                        .value as PricingTypeValue
                )
                : servicePrice?.pricingType;

        /*
         * -----------------------------
         * MAX DAILY BOOKINGS
         * -----------------------------
         */
        const maxDailyBookings =
            serviceInputs
                ?.maxDailyBookings
                ? Number(
                    serviceInputs
                        .maxDailyBookings
                        .value
                )
                : service.maxDailyBookings;

        /*
         * -----------------------------
         * CURRENCY
         * -----------------------------
         *
         * CurrencySelect gives:
         *
         * USD | GBP | NGN
         *
         * API expects:
         *
         * DOLLAR | POUNDS | NAIRA
         */
        const currencyCode =
            editingCurrency[
            service.id
            ] ??
            (servicePrice?.currency
                ? mapCurrency(
                    servicePrice.currency
                )
                : "NGN");

        const currency =
            mapCurrencyType(
                currencyCode
            );

        /*
         * -----------------------------
         * SERVICE PRICE PAYLOAD
         * -----------------------------
         */
        const servicePricePayload:
            | ServicePricePayload
            | undefined =
            servicePrice
                ? {
                    ...servicePrice,
                    amount,
                    pricingType,
                    currency,
                }
                : undefined;

        /*
         * -----------------------------
         * SERVICE PAYLOAD
         * -----------------------------
         */
        const {
            id,
            prices,
            ...rest
        } = service;

        try {
            await updateServiceMutation
                .mutateAsync({
                    id,

                    payload: {
                        ...rest,
                        name,
                        description,
                        maxDailyBookings,
                    },

                    servicePricePayload,
                });

            /*
             * Only exit edit mode
             * after successful mutation.
             */
            setEditingServiceId(
                null
            );

            setEditingCurrency(
                (prev) => {
                    const updated = {
                        ...prev,
                    };

                    delete updated[
                        service.id
                    ];

                    return updated;
                }
            );
        } catch (error) {
            console.error(
                "Failed to update service:",
                error
            );
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLSpanElement>
    ) => {
        if (e.key === "Escape") {
            e.preventDefault();

            handleCancel();
        }
    };

    const handleServiceSelect = (serviceId: string) => {
        setSelectedServiceIds((prev) => {
            const next = new Set(prev);

            if (next.has(serviceId)) {
                next.delete(serviceId);
            } else {
                next.add(serviceId);
            }

            return next;
        })
    }

    const selectedServices = filteredServices.filter(
        (service) => selectedServiceIds.has(service.id)
    );

    const hasActiveSelected = selectedServices.some(
        (service) => service.isActive
    );

    const hasInactiveSelected = selectedServices.some(
        (service) => !service.isActive
    );

    const canDeactivate =
        selectedServices.length > 0 && !hasInactiveSelected;

    const canReactivate =
        selectedServices.length > 0 && !hasActiveSelected;


    const handleDeactivate = async () => {
        if (!canDeactivate) return;
        const ids = Array.from(selectedServiceIds);

        try {
            await deactivateServiceMutation.mutateAsync({
                idPayload: {
                    ids,
                }
            })

            setSelectedServiceIds(new Set())
        } catch (error) {
            console.error(
                "Failed to deactivate services", error
            )
        }
    }

    const handleReactivate = async () => {
        if (!canReactivate) return;

        const ids = Array.from(selectedServiceIds);
        try {
            await reactivateServiceMutation.mutateAsync({
                idPayload: {
                    ids,
                }
            })
            setSelectedServiceIds(new Set())
        } catch (error) {
            console.error(
                "Failed to reactivate services", error
            )
        }
    }

    return (
        <div
            className={
                styles.serviceslist
            }
        >{/* ====== Deactivate and reactivate button for company user*/}
            {isCompanyUser && selectedServices.length > 0 && (
                <div>
                    {canDeactivate && (
                        <button
                            type="button"
                            onClick={handleDeactivate}
                            disabled={
                                deactivateServiceMutation.isPending
                            }
                        >
                            {deactivateServiceMutation.isPending
                                ? "Deactivating..."
                                : "Deactivate Selected"
                            }
                        </button>
                    )}
                    {canReactivate && (
                        <button
                            type="button"
                            onClick={handleReactivate}
                            disabled={
                                reactivateServiceMutation.isPending
                            }
                        >
                            {reactivateServiceMutation.isPending
                                ? "Reactivating..."
                                : "Reactivate Selected"
                            }
                        </button>
                    )}
                </div>
            )}
            {filteredServices.map(
                (service) => {
                    const isEditing =
                        editingServiceId ===
                        service.id;

                    const isSelected =
                        selectedServiceIds.has(service.id);

                    const servicePrice =
                        service.prices?.[0];

                    return (
                        <form
                            key={
                                service.id
                            }
                            className={
                                styles.servicelistrow
                            }
                            id={service.name
                                .toLowerCase()
                                .replace(
                                    /\s+/g,
                                    "-"
                                )}
                            onSubmit={(e) =>
                                e.preventDefault()
                            }
                        >
                            {/* =========================
                                NAME
                            ========================== */}

                            <span>
                                <b>
                                    Name
                                </b>
                                :{" "}

                                <span
                                    ref={(
                                        element
                                    ) => {
                                        if (
                                            !spanRef
                                                .current[
                                            service
                                                .id
                                            ]
                                        ) {
                                            spanRef
                                                .current[
                                                service
                                                    .id
                                            ] = {};
                                        }

                                        spanRef
                                            .current[
                                            service
                                                .id
                                        ].name =
                                            element;
                                    }}
                                    contentEditable={
                                        isEditing
                                            ? "plaintext-only"
                                            : false
                                    }
                                    suppressContentEditableWarning
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    className={
                                        isEditing
                                            ? styles.serviceupdatespan
                                            : undefined
                                    }
                                >
                                    {
                                        service.name
                                    }
                                </span>
                            </span>

                            {/* =========================
                                DESCRIPTION
                            ========================== */}

                            <span>
                                <b>
                                    Description
                                </b>
                                :{" "}

                                <span
                                    ref={(
                                        element
                                    ) => {
                                        if (
                                            !spanRef
                                                .current[
                                            service
                                                .id
                                            ]
                                        ) {
                                            spanRef
                                                .current[
                                                service
                                                    .id
                                            ] = {};
                                        }

                                        spanRef
                                            .current[
                                            service
                                                .id
                                        ].description =
                                            element;
                                    }}
                                    contentEditable={
                                        isEditing
                                            ? "plaintext-only"
                                            : false
                                    }
                                    suppressContentEditableWarning
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    className={
                                        isEditing
                                            ? styles.serviceupdatespan
                                            : undefined
                                    }
                                >
                                    {
                                        service.description
                                    }
                                </span>
                            </span>

                            {/* =========================
                                PRICE
                            ========================== */}

                            <span>
                                <b>
                                    Price
                                </b>
                                :{" "}

                                {isEditing ? (
                                    <span
                                        className={
                                            styles.priceEditContainer
                                        }
                                    >
                                        <CurrencySelect
                                            id={`currency-${service.id}`}
                                            currentCurrency={
                                                editingCurrency[
                                                service
                                                    .id
                                                ] ??
                                                (servicePrice?.currency
                                                    ? mapCurrency(
                                                        servicePrice.currency
                                                    )
                                                    : "NGN")
                                            }
                                            onCurrencyChange={(
                                                newCurrency
                                            ) => {
                                                setEditingCurrency(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        [service
                                                            .id]:
                                                            newCurrency as Currency,
                                                    })
                                                );
                                            }}
                                        />

                                        <input
                                            ref={(
                                                element
                                            ) => {
                                                if (
                                                    !inputRef
                                                        .current[
                                                    service
                                                        .id
                                                    ]
                                                ) {
                                                    inputRef
                                                        .current[
                                                        service
                                                            .id
                                                    ] =
                                                        {};
                                                }

                                                inputRef
                                                    .current[
                                                    service
                                                        .id
                                                ].amount =
                                                    element;
                                            }}
                                            type="number"
                                            defaultValue={
                                                servicePrice?.amount ??
                                                ""
                                            }
                                            min={
                                                0
                                            }
                                            className={
                                                styles.serviceupdateinput
                                            }
                                        />
                                    </span>
                                ) : (
                                    <>
                                        {servicePrice && (
                                            <>
                                                {
                                                    mapCurrencySymbol(
                                                        servicePrice.currency
                                                    )
                                                }{" "}
                                                {
                                                    servicePrice.amount
                                                }
                                            </>
                                        )}
                                    </>
                                )}
                            </span>

                            {/* =========================
                                PRICING TYPE
                            ========================== */}

                            <span>
                                <b>
                                    Pricing
                                    type
                                </b>
                                :{" "}

                                {isEditing ? (
                                    <select
                                        ref={(
                                            element
                                        ) => {
                                            if (
                                                !inputRef
                                                    .current[
                                                service
                                                    .id
                                                ]
                                            ) {
                                                inputRef
                                                    .current[
                                                    service
                                                        .id
                                                ] =
                                                    {};
                                            }

                                            inputRef
                                                .current[
                                                service
                                                    .id
                                            ].pricingType =
                                                element;
                                        }}
                                        defaultValue={
                                            servicePrice?.pricingType ??
                                            ""
                                        }
                                        className={
                                            styles.serviceupdateselect
                                        }
                                    >
                                        <option value="PER_KG">
                                            Per Kg
                                        </option>

                                        <option value="PER_ITEM">
                                            Per Item
                                        </option>

                                        <option value="FLAT_RATE">
                                            Flat
                                            Rate
                                        </option>
                                    </select>
                                ) : (
                                    <>
                                        {servicePrice &&
                                            mapPricingType(
                                                servicePrice.pricingType
                                            )}
                                    </>
                                )}
                            </span>

                            {/* =========================
                                PROMOCODES
                            ========================== */}

                            <span>
                                <b>
                                    Promocodes
                                </b>
                                :{" "}
                                {service.promoCodes
                                    ?.map(
                                        (
                                            promo
                                        ) =>
                                            promo.code
                                    )
                                    .join(
                                        ", "
                                    )}
                            </span>

                            {/* =========================
                                COMPANY ONLY
                            ========================== */}

                            {isCompanyUser && (
                                <span
                                    className={
                                        styles.companyOnlyserviceitemContainer
                                    }
                                >
                                    <span
                                        className={
                                            styles.companviewserviceitems
                                        }
                                    >
                                        {/* MAX DAILY BOOKINGS */}

                                        <span>
                                            <b>
                                                Maximum
                                                daily
                                                bookings
                                            </b>
                                            :{" "}

                                            {isEditing ? (
                                                <input
                                                    ref={(
                                                        element
                                                    ) => {
                                                        if (
                                                            !inputRef
                                                                .current[
                                                            service
                                                                .id
                                                            ]
                                                        ) {
                                                            inputRef
                                                                .current[
                                                                service
                                                                    .id
                                                            ] =
                                                                {};
                                                        }

                                                        inputRef
                                                            .current[
                                                            service
                                                                .id
                                                        ].maxDailyBookings =
                                                            element;
                                                    }}
                                                    type="number"
                                                    min={
                                                        0
                                                    }
                                                    defaultValue={
                                                        service.maxDailyBookings ??
                                                        ""
                                                    }
                                                    className={
                                                        styles.serviceupdateinput
                                                    }
                                                />
                                            ) : (
                                                service.maxDailyBookings
                                            )}
                                        </span>

                                        {/* TIMESTAMPS */}

                                        <span
                                            className={
                                                styles.servicestimestamp
                                            }
                                        >
                                            <b>
                                                Timestamps
                                            </b>

                                            <span>
                                                <b>
                                                    Created
                                                    at:
                                                </b>{" "}
                                                {
                                                    service.createdAt
                                                }
                                            </span>

                                            {service.updatedAt && (
                                                <span>
                                                    <b>
                                                        Updated
                                                        at:
                                                    </b>{" "}
                                                    {
                                                        service.updatedAt
                                                    }
                                                </span>
                                            )}

                                            {service.deletedAt && (
                                                <span>
                                                    <b>
                                                        Deleted
                                                        at:
                                                    </b>{" "}
                                                    {
                                                        service.deletedAt
                                                    }
                                                </span>
                                            )}
                                        </span>
                                    </span>

                                    {/* =========================
                                        ACTION BUTTONS
                                    ========================== */}

                                    <span
                                        className={
                                            styles.serviceListactionbtns
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                handleServiceSelect(
                                                    service.id
                                                )
                                            }
                                            disabled={isEditing}
                                        />
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                className={
                                                    styles.editbtn
                                                }
                                                onClick={() =>
                                                    handleEdit(
                                                        service
                                                    )
                                                }
                                            >
                                                <FiEdit />
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSave(
                                                            service
                                                        )
                                                    }
                                                    disabled={
                                                        updateServiceMutation.isPending
                                                    }
                                                >
                                                    {updateServiceMutation.isPending
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCancel
                                                    }
                                                    disabled={
                                                        updateServiceMutation.isPending
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        <button
                                            type="button"
                                            className={
                                                styles.trashbtn
                                            }
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </span>
                                </span>
                            )}
                        </form>
                    );
                }
            )}
        </div>
    );
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
                {props.companyuser?.uiRole === "ADMIN" && (
                    <section>
                        <h4>Inactive Services</h4>
                        <ServicesList user={props.companyuser} isActive={false} />
                    </section>
                )}

            </section>
        </div>
    )
}