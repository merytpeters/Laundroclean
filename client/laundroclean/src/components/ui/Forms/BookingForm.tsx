import React, { useState, useContext, useEffect } from 'react';
import styles from './BookingForm.module.css';
import Button from '../Button/Button';
import { mapDeliveryType } from '../../../types/booking/bookingStatus';
import { CompanyUserMenuContext } from 'src/components/layouts/CompanyUser/context/CompanyUserMenuContext';
import { useCreateBooking } from 'src/hooks/booking/useBooking';
import { useCreateCalendarRow } from 'src/hooks/calendar/useCalendar';
import { useForm } from 'react-hook-form';
import { BookingFormValues, BookingPayload } from 'src/types/booking/booking';
import { ProfileResponse, User } from 'src/types/users/user';
import { ServicesDto } from 'src/types/laundrocleanServices/laundrocleanservices.dto';
import { mapCurrencySymbol } from 'src/types/laundrocleanServices/laundroservices';
import { useGetUsers } from 'src/hooks/companyUser/useUser/useUser';
import { useDebounce } from 'src/hooks/debounceHook';
import { UserProfileDto } from 'src/types/users/user.dto';
import { CalendarRowPayload } from 'src/types/calendar/calendar';
import { toUTCISOString } from 'src/utils/globalTimezone';
import { toast } from 'sonner';


interface PaymentButtonProps {
    onClose?: () => void;
    onPayLater?: () => void;
    className?: string;
}
function PaymentButton(props: PaymentButtonProps) {
    const context = useContext(CompanyUserMenuContext) as React.ContextType<typeof CompanyUserMenuContext> | undefined;
    const contextUser = context?.user;
    const setActiveMenu = context?.setActiveMenu;

    const typeRoutes: Record<string, string> = {
        CLIENT: "/user/payment",
        COMPANYUSER: "/dashboard"
    };

    const userType = contextUser?.type ?? 'CLIENT';
    const href = typeRoutes[userType] || "/user/payment";

    return (
        <div className={`${props.className ?? ''}`}>
            <div className={styles.paymentbuttoncontainer}>
                {userType === "COMPANYUSER" ? (
                    <Button text='Proceed to payment' className={styles.paynowOrlater}
                        onClick={() => setActiveMenu?.("payment")}
                    ></Button>
                ) : (
                    <Button text='Proceed to payment' className={styles.paynowOrlater}
                        href={href}
                    ></Button>
                )}

                <Button text='Pay Later' className={styles.paynowOrlater} onClick={() => { props.onPayLater?.(); props.onClose?.(); }}></Button>
            </div>
        </div>
    );
}

export interface BookingFormProps {
    staffAssignedSlot?: React.ReactNode;
    actions?: React.ReactNode;
    showStaffAssignedSlot?: boolean;
    services?: ServicesDto | null;
    user?: {
        authUser: User | null;
        authProfile: ProfileResponse | null;
    };
    staffOptions?: UserProfileDto[] | null;
    deliveryOptions?: { value: string; label: string }[];
}

export default function BookingForm({
    staffAssignedSlot,
    actions,
    showStaffAssignedSlot = false,
    services,
    user,
    staffOptions,
    deliveryOptions,
}: BookingFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<
        "line1" | "line2" | "new" | ""
    >("");

    const [bookingAmount, setBookingAmount] = useState<
        number | string | null
    >(null);

    const deliveryOpts =
        deliveryOptions ??
        (() => {
            const vals = ["PICK_UP", "DROP_OFF"];

            return vals.map((value) => {
                try {
                    return {
                        value,
                        label: mapDeliveryType(value),
                    };
                } catch {
                    return {
                        value,
                        label: value
                            .replace(/_/g, " ")
                            .toLowerCase(),
                    };
                }
            });
        })();

    const formData = useForm<BookingFormValues>({
        defaultValues: {
            email: user?.authUser?.email ?? "",
            address: {
                firstName: user?.authUser?.firstName ?? "",
                lastName: user?.authUser?.lastName ?? "",
                phoneNumber:
                    user?.authProfile?.phoneNumber ?? "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                postalCode: "",
            },
            serviceId: "",
            deliveryType: undefined,
            promoCode: "",
            additionalNotes: "",
            scheduledDate: "",
            scheduledTime: "12:00",
            pickupDate: "",
            pickupTime: "12:00",
            date: "",
            time: "12:00",
        },
    });

    /*
     * --------------------------------------------------
     * EMAIL SEARCH
     * --------------------------------------------------
     */

    const email = formData.watch("email");
    const debouncedEmail = useDebounce(email, 500);

    const queryParams = {
        search: debouncedEmail.trim(),
    };

    const { data: usersData } = useGetUsers(
        {},
        queryParams
    );

    const searchedUser = usersData?.data?.[0];

    /*
     * --------------------------------------------------
     * SELECTED SERVICE
     * --------------------------------------------------
     */

    const selectedServiceId = formData.watch("serviceId");

    const selectedService = services?.find(
        (service) =>
            String(service.id) === selectedServiceId
    );

    const selectedDeliveryType = formData.watch("deliveryType");

    // console.log("Selected delivery type:", selectedDeliveryType);

    /*
     * --------------------------------------------------
     * POPULATE USER INFORMATION
     * --------------------------------------------------
     */

    useEffect(() => {
        if (!searchedUser && !user?.authUser) {
            return;
        }

        formData.setValue(
            "address.firstName",
            user?.authUser?.firstName ??
            searchedUser?.user?.firstName ??
            ""
        );

        formData.setValue(
            "address.lastName",
            user?.authUser?.lastName ??
            searchedUser?.user?.lastName ??
            ""
        );

        formData.setValue(
            "address.phoneNumber",
            user?.authProfile?.phoneNumber ??
            searchedUser?.phoneNumber ??
            ""
        );
    }, [
        searchedUser,
        user?.authUser,
        user?.authProfile,
        formData,
    ]);

    /*
     * --------------------------------------------------
     * POPULATE EMAIL FOR LOGGED-IN USER
     * --------------------------------------------------
     */

    useEffect(() => {
        if (
            user?.authUser?.email &&
            !formData.getValues("email")
        ) {
            formData.setValue(
                "email",
                user.authUser.email
            );
        }
    }, [
        user?.authUser?.email,
        formData,
    ]);


    useEffect(() => {
        if (selectedDeliveryType === "DROP_OFF") {
            toast.message("Check for nearest drop off location");
        }
    }, [selectedDeliveryType]);

    /*
     * --------------------------------------------------
     * SAVED ADDRESS
     * --------------------------------------------------
     */

    const addressLine1 =
        user?.authProfile?.addressLine1 ??
        searchedUser?.addressLine1 ??
        "";

    const addressLine2 =
        user?.authProfile?.addressLine2 ??
        searchedUser?.addressLine2 ??
        "";

    const hasSavedAddress =
        Boolean(addressLine1) ||
        Boolean(addressLine2);

    /*
     * --------------------------------------------------
     * ADDRESS SELECT
     * --------------------------------------------------
     *
     * Important:
     * Selecting line1 puts the value in addressLine1.
     * Selecting line2 puts the value in addressLine2.
     *
     * The other line is cleared so that selecting line2
     * does NOT accidentally send line1 as well.
     */

    const handleAddressChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value as
            | "line1"
            | "line2"
            | "new"
            | "";

        setSelectedAddressId(value);

        if (value === "line1") {
            formData.setValue(
                "address.addressLine1",
                addressLine1
            );

            formData.setValue(
                "address.addressLine2",
                ""
            );
        } else if (value === "line2") {
            formData.setValue(
                "address.addressLine1",
                ""
            );

            formData.setValue(
                "address.addressLine2",
                addressLine2
            );
        } else if (value === "new") {
            formData.setValue(
                "address.addressLine1",
                ""
            );

            formData.setValue(
                "address.addressLine2",
                ""
            );
        } else {
            formData.setValue(
                "address.addressLine1",
                ""
            );

            formData.setValue(
                "address.addressLine2",
                ""
            );
        }
    };

    /*
     * --------------------------------------------------
     * CURRENCY
     * --------------------------------------------------
     */

    const currency =
        selectedService?.prices?.[0]?.currency;

    const currencySymbol = currency
        ? mapCurrencySymbol(currency)
        : "";

    /*
     * --------------------------------------------------
     * CREATE BOOKING
     * --------------------------------------------------
     */

    const createCalendarRowMutation = useCreateCalendarRow()

    const selectedAssignedToId = formData.watch("assignedToId");

    const createBookingMutation =
        useCreateBooking();

    const handleCreateBooking = async (
        values: BookingFormValues
    ) => {

        let assignedToId = values.assignedToId;
        if (values.assignedToId) {
            const calendarPayload: CalendarRowPayload = {
                userId: values.assignedToId,
                date: toUTCISOString(
                    values.date,
                    values.time
                ),
            };

            try {
                const calendarResponse =
                    await createCalendarRowMutation.mutateAsync({
                        payload: calendarPayload,
                    });

                assignedToId =
                    calendarResponse?.data?.userId ??
                    values.assignedToId;

            } catch (error) {
                return;
            }
        }

        const payload = {
            ...values,

            scheduledDate: toUTCISOString(
                values.scheduledDate,
                values.scheduledTime
            ),

            pickupTime:
                values.deliveryType === "PICK_UP"
                    ? toUTCISOString(
                        values.pickupDate,
                        values.pickupTime
                    )
                    : undefined,
        };
        createBookingMutation.mutate(
            {
                payload
            },
            {
                onSuccess: (response) => {
                    const finalAmount =
                        response?.data?.finalAmount;

                    if (
                        finalAmount !== undefined &&
                        finalAmount !== null
                    ) {
                        const amountToPay =
                            `${currencySymbol} ${finalAmount}`;

                        setBookingAmount(
                            amountToPay
                        );

                        setOpen(true);
                    }
                },
            }
        );
    };



    return (
        <form
            className={styles.form}
            onSubmit={formData.handleSubmit(
                handleCreateBooking
            )}
        >
            {/* -----------------------------------------
                EMAIL / USER INFORMATION
            ----------------------------------------- */}

            <section
                className={
                    styles.emailaddresssection
                }
            >
                <div
                    className={`${styles.field} ${styles.fullWidthField}`}
                >
                    <label htmlFor="email">
                        email
                    </label>

                    <input
                        id="email"
                        type="email"
                        {...formData.register(
                            "email"
                        )}
                    />
                </div>

                <div
                    className={styles.field}
                >
                    <label htmlFor="firstName">
                        first Name
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        {...formData.register(
                            "address.firstName"
                        )}
                    />
                </div>

                <div
                    className={styles.field}
                >
                    <label htmlFor="lastName">
                        last Name
                    </label>

                    <input
                        id="lastName"
                        type="text"
                        {...formData.register(
                            "address.lastName"
                        )}
                    />
                </div>

                {/* -----------------------------------------
                    ADDRESS
                ----------------------------------------- */}

                <div
                    className={`${styles.field} ${styles.fullWidthField}`}
                >
                    <label htmlFor="address_select">
                        address
                    </label>

                    {hasSavedAddress ? (
                        <>
                            <select
                                id="address_select"
                                value={
                                    selectedAddressId
                                }
                                onChange={
                                    handleAddressChange
                                }
                            >
                                <option value="">
                                    Use default / select
                                    address
                                </option>

                                {addressLine1 && (
                                    <option value="line1">
                                        {addressLine1}
                                    </option>
                                )}

                                {addressLine2 && (
                                    <option value="line2">
                                        {addressLine2}
                                    </option>
                                )}

                                <option value="new">
                                    Add new address
                                </option>
                            </select>

                            {selectedAddressId ===
                                "new" && (
                                    <div
                                        className={
                                            styles.newaddress
                                        }
                                    >
                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <label htmlFor="new_address_line1">
                                                address line 1
                                            </label>

                                            <input
                                                id="new_address_line1"
                                                type="text"
                                                {...formData.register(
                                                    "address.addressLine1"
                                                )}
                                            />
                                        </div>

                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <label htmlFor="new_address_line2">
                                                address line 2
                                            </label>

                                            <input
                                                id="new_address_line2"
                                                type="text"
                                                {...formData.register(
                                                    "address.addressLine2"
                                                )}
                                            />
                                        </div>

                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <label htmlFor="new_address_city">
                                                City
                                            </label>

                                            <input
                                                id="new_address_city"
                                                type="text"
                                                {...formData.register(
                                                    "address.city"
                                                )}
                                            />
                                        </div>

                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <label htmlFor="new_address_state">
                                                state
                                            </label>

                                            <input
                                                id="new_address_state"
                                                type="text"
                                                {...formData.register(
                                                    "address.state"
                                                )}
                                            />
                                        </div>

                                        <div
                                            className={
                                                styles.field
                                            }
                                        >
                                            <label htmlFor="new_address_postcode">
                                                postcode
                                            </label>

                                            <input
                                                id="new_address_postcode"
                                                type="text"
                                                {...formData.register(
                                                    "address.postalCode"
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                        </>
                    ) : (
                        <div
                            className={
                                styles.newaddress
                            }
                        >
                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="address_line1">
                                    address line 1
                                </label>

                                <input
                                    id="address_line1"
                                    type="text"
                                    {...formData.register(
                                        "address.addressLine1"
                                    )}
                                />
                            </div>

                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="address_line2">
                                    address line 2
                                </label>

                                <input
                                    id="address_line2"
                                    type="text"
                                    {...formData.register(
                                        "address.addressLine2"
                                    )}
                                />
                            </div>

                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="address_city">
                                    city
                                </label>

                                <input
                                    id="address_city"
                                    type="text"
                                    {...formData.register(
                                        "address.city"
                                    )}
                                />
                            </div>

                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="address_state">
                                    state
                                </label>

                                <input
                                    id="address_state"
                                    type="text"
                                    {...formData.register(
                                        "address.state"
                                    )}
                                />
                            </div>

                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="address_postcode">
                                    postcode
                                </label>

                                <input
                                    id="address_postcode"
                                    type="text"
                                    {...formData.register(
                                        "address.postalCode"
                                    )}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* -----------------------------------------
                SERVICE + PROMO
            ----------------------------------------- */}

            <section
                className={
                    styles.servicepromosection
                }
            >
                <div
                    className={styles.field}
                >
                    <label htmlFor="serviceId">
                        services
                    </label>

                    <select
                        id="serviceId"
                        {...formData.register(
                            "serviceId"
                        )}
                    >
                        <option value="">
                            select service
                        </option>

                        {services?.map(
                            (service) => (
                                <option
                                    key={service.id}
                                    value={service.id}
                                >
                                    {service.name}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div
                    className={styles.field}
                >
                    <label htmlFor="promoCode">
                        promo codes
                    </label>

                    <select
                        id="promoCode"
                        {...formData.register(
                            "promoCode"
                        )}
                    >
                        <option value="">
                            select promo code
                        </option>

                        {selectedService?.promoCodes?.map(
                            (promoCode) => (
                                <option
                                    key={
                                        promoCode.id
                                    }
                                    value={
                                        promoCode.code
                                    }
                                >
                                    {promoCode.code}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </section>

            {/* -----------------------------------------
                ITEM INFORMATION
            ----------------------------------------- */}

            <section
                className={
                    styles.iteminformationsection
                }
            >
                {selectedService?.prices?.[0]
                    ?.pricingType ===
                    "PER_ITEM" && (
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="itemCount">
                                number of items
                            </label>

                            <input
                                id="itemCount"
                                type="number"
                                min="1"
                                {...formData.register(
                                    "itemCount",
                                    {
                                        valueAsNumber:
                                            true,
                                    }
                                )}
                            />
                        </div>
                    )}

                {selectedService?.prices?.[0]
                    ?.pricingType ===
                    "PER_KG" && (
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="weight">
                                weight (kg)
                            </label>

                            <input
                                id="weight"
                                type="number"
                                step="0.01"
                                {...formData.register(
                                    "weight",
                                    {
                                        valueAsNumber:
                                            true,
                                    }
                                )}
                            />
                        </div>
                    )}

                {selectedService?.prices?.[0]
                    ?.pricingType ===
                    "FLAT_RATE" && (
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="flat_rate">
                                flat rate
                            </label>

                            <input
                                id="flat_rate"
                                type="text"
                                placeholder={`${currencySymbol} ${selectedService.prices?.[0]?.amount ?? ""}`}
                                disabled
                            />
                        </div>
                    )}
            </section>

            {/* -----------------------------------------
                DELIVERY
            ----------------------------------------- */}

            <section
                className={
                    styles.deliveryinfosection
                }
            >
                <div
                    className={`${styles.field} ${styles.fullWidthField}`}
                >
                    <label htmlFor="deliveryType">
                        delivery type
                    </label>

                    <select
                        id="deliveryType"
                        defaultValue=""
                        {...formData.register(
                            "deliveryType"
                        )}
                    >
                        <option value="">
                            Select delivery type
                        </option>

                        {deliveryOpts.map(
                            (opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            )
                        )}
                    </select>
                </div>
                {selectedDeliveryType === "PICK_UP" && (
                    <div
                        className={styles.field}
                    >
                        <label htmlFor="pickupDate">
                            pickup Date
                        </label>
                        <input
                            id="pickupDate"
                            type="date"
                            {...formData.register(
                                "pickupDate"
                            )}
                        />
                        <label htmlFor="pickupTime">
                            pickup Time
                        </label>

                        <input
                            id="pickupTime"
                            type="time"
                            {...formData.register(
                                "pickupTime"
                            )}
                        />
                    </div>
                )}

                <div
                    className={styles.field}
                >
                    <label htmlFor="scheduledDate">
                        scheduled delivery Date
                    </label>

                    <input
                        id="scheduledDate"
                        type="date"
                        {...formData.register(
                            "scheduledDate"
                        )}
                    />
                    <label htmlFor="scheduledTime">
                        scheduled delivery Time
                    </label>

                    <input
                        id="scheduledTime"
                        type="time"
                        {...formData.register(
                            "scheduledTime"
                        )}
                    />
                </div>
            </section>

            {/* -----------------------------------------
                STAFF
            ----------------------------------------- */}

            {showStaffAssignedSlot && (
                <section
                    className={
                        styles.staffassignedslot
                    }
                >
                    {staffAssignedSlot ?? (
                        <>
                            <div
                                className={`${styles.field} ${styles.fullWidthField}`}
                            >
                                <label htmlFor="assignedToId">
                                    assign staff
                                </label>

                                <select
                                    id="assignedToId"
                                    {...formData.register(
                                        "assignedToId"
                                    )}
                                >
                                    <option value="">
                                        Unassigned
                                    </option>

                                    {staffOptions?.map(
                                        (staff) => (
                                            <option
                                                key={
                                                    staff.user.id
                                                }
                                                value={
                                                    staff.user.id
                                                }
                                            >
                                                {
                                                    staff
                                                        .user
                                                        .firstName
                                                }{" "}
                                                {
                                                    staff
                                                        .user
                                                        .lastName
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div
                                className={`${styles.field} ${styles.fullWidthField}`}
                            >
                                {selectedAssignedToId && (
                                    <>
                                        <label htmlFor="date">
                                            assigned date
                                        </label>
                                        <input
                                            type="date"
                                            {...formData.register("date")}
                                        />

                                        <label htmlFor="time">
                                            assigned time
                                        </label>
                                        <input
                                            type="time"
                                            {...formData.register("time")}
                                        />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* -----------------------------------------
                NOTES
            ----------------------------------------- */}

            <section
                className={
                    styles.specialnotesection
                }
            >
                <label htmlFor="additionalNotes">
                    Additional notes
                </label>

                <textarea
                    id="additionalNotes"
                    rows={4}
                    {...formData.register(
                        "additionalNotes"
                    )}
                />
            </section>

            {/* -----------------------------------------
                ACTIONS
            ----------------------------------------- */}

            <div
                className={styles.formactions}
            >
                {actions ?? (
                    <div
                        className={
                            styles.bookButtonContainer
                        }
                    >
                        <Button
                            text={
                                createBookingMutation.isPending
                                    ? "Booking..."
                                    : "Book"
                            }
                            type="submit"
                            className={
                                styles.bookButton
                            }
                            disabled={
                                createBookingMutation.isPending
                            }
                        />

                        {open && (
                            <span
                                className={
                                    styles.paymentdetailsnaction
                                }
                            >
                                <span
                                    className={
                                        styles.amountdisplay
                                    }
                                >
                                    {bookingAmount ??
                                        "Amount unavailable"}
                                </span>

                                <PaymentButton
                                    onClose={() =>
                                        setOpen(
                                            false
                                        )
                                    }
                                    className={
                                        styles.paymentbuttonoverlay
                                    }
                                />
                            </span>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
}

