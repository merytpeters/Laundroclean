"use client";
import styles from "./BookingDisplayTable.module.css"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { useEffect, useState } from "react";
import { formatDateTime } from "src/utils/globalTimezone";
import { useGetBookingSettings, useHardDeleteBookings, useSetMinimumPickupDays, useUpdateBookingStatus } from "src/hooks/booking/useBooking";
import { BookingStatusPayload, minimumPickupdaysPayload } from "src/types/booking/booking";
import { BookingDto, BookingStatusDto } from "src/types/booking/booking.dto";
import { toast } from "sonner";
import Button from "../Button/Button";
import { capitalilzeFirstLetter } from "src/utils/capitalize";
import { statusClassMap } from "src/types/booking/bookingStatus";
import statusMapStyle from '../flexboxes/ScheduleCard.module.css';
import { CompanyBookingStatusSelect } from "../Modals/CompanyUser/BookingStatusSelect/BookingStatusSelect";


// const mappedDetails: BookingDetail[] = transformFieldInArray(mappedDelivery, "status", mapBookingStatus)
export type BookingListProp = {
    mappedBookingData: BookingDto[];
};

export default function BookingDisplayTable({ mappedBookingData }: BookingListProp) {
    const { user, setActiveMenu } = useCompanyUserMenu();
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
    const [isEditBookingStatusId, setIsEditBookingStatusId] = useState<string | null>(null);
    const [newBookingStatus, setNewBookingStatus] = useState<Record<string, BookingStatusDto>>({});

    const updateBookingStatusMutation = useUpdateBookingStatus();

    const resetBookingStatusEditing = () => {
        setIsEditBookingStatusId(null);
    }
    const handleUpdateBookingStatus = (bookingId: string, payload: BookingStatusPayload) => {
        updateBookingStatusMutation.mutate(
            { bookingId, payload },
            {
                onSuccess: () => {
                    resetBookingStatusEditing();
                }
            }
        )
    }


    const roleRoutes = {
        ADMIN: "/admin/controlpanel/bookings",
        STAFF: "/dashboard"
    }

    if (!user.uiRole) return null;
    const href = roleRoutes[user.uiRole] || "/dashboard";

    return (
        <section className={styles.BookingDisplayTable}>
            <h3>All Bookings</h3>
            <span>Manage customer bookings and appointments</span>

            <table className={styles.bdctable}>

                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date Booked</th>
                        <th>Pickup/Delivery Date</th>
                        <th>Delivery Tag</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Assigned Staff</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mappedBookingData.slice(0, 6).map((bookingDetail) => (
                        <tr key={bookingDetail.id}>

                            <td className={styles.moredetails}
                                onClick={() => setSelectedBooking(bookingDetail)}
                            >{bookingDetail.customBookingId}</td>
                            <td>{bookingDetail.profile?.user?.firstName} {bookingDetail.profile?.user?.lastName}</td>
                            <td>{bookingDetail.service?.name}</td>
                            <td>
                                {bookingDetail.transactions?.[0]?.paidAt
                                    ? formatDateTime(bookingDetail.transactions[0].paidAt)
                                    : "Unpaid"}
                            </td>
                            <td>{formatDateTime(bookingDetail.scheduledDate)}</td>
                            <td>{bookingDetail.deliveryType}</td>
                            {bookingDetail.mappedStatus && (
                                <td>
                                    {isEditBookingStatusId === bookingDetail.id ? (
                                        <CompanyBookingStatusSelect
                                            id={`booking-status-${bookingDetail.id}`}
                                            currentStatus={
                                                newBookingStatus[
                                                bookingDetail.id
                                                ] ?? (
                                                    bookingDetail.status
                                                )
                                            }
                                            onStatusChange={(
                                                newStatus
                                            ) => {
                                                const selectedStatus = newStatus as BookingStatusDto;
                                                setNewBookingStatus(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        [bookingDetail.id]:
                                                            selectedStatus
                                                    })
                                                )
                                                setIsEditBookingStatusId(null)
                                                handleUpdateBookingStatus(bookingDetail.id, { status: selectedStatus } as BookingStatusPayload)
                                            }}
                                        />
                                    ) : (
                                        <span className={`${statusMapStyle.status} ${statusMapStyle[statusClassMap[bookingDetail.mappedStatus]]}`} style={{ cursor: "pointer" }} onClick={() => (setIsEditBookingStatusId(bookingDetail.id))}>
                                            {capitalilzeFirstLetter(bookingDetail.mappedStatus)}
                                        </span>
                                    )}
                                </td>)}
                            <td>{bookingDetail.currency} {bookingDetail.finalAmount}</td>
                            <td>
                                {user.uiRole === "ADMIN" || user.id === bookingDetail.assignedToId ? (
                                    <>
                                        {bookingDetail.assignedTo?.firstName ?? ""}{" "}
                                        {bookingDetail.assignedTo?.lastName ?? ""}
                                    </>
                                ) : (
                                    "_"
                                )}
                            </td>
                            <td>
                                <button className={styles.editbtn}>
                                    <FiEdit color="blue" />
                                </button>
                                {user.uiRole === "ADMIN" && bookingDetail.status === "CANCELLED" && (
                                    <button className={styles.trashbtn}>
                                        <FiTrash2 />
                                    </button>

                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <div className={styles.actions}>
                {user.uiRole === "STAFF" ? (
                    <button
                        className={styles.viewmore}
                        onClick={() => setActiveMenu("calendar")}
                    >
                        view more
                    </button>
                ) : (
                    <button className={styles.viewmore}> <a href={href}>view more</a></button>
                )}
            </div>
            <BookingDetailsOverlay isOpen={selectedBooking !== null} item={selectedBooking} onClose={() => setSelectedBooking(null)} />

        </section>
    )
}


export function BookingSettings() {
    const [minPickupDays, setMinPickupDays] = useState("");
    const minimumPickupDaysMutation = useSetMinimumPickupDays();
    const { data, isError, error } = useGetBookingSettings();
    const bookingSettingsData = data?.data;

    useEffect(() => {
        if (isError && error) {
            toast(error.message);
            console.log(error.message)
        }
    }, [isError, error]);

    const handleSetMinimumPickupDays = () => {
        const days = Number(minPickupDays);
        if (!Number.isInteger(days) || days < 0) { return; }
        const payload: minimumPickupdaysPayload = { minPickupDays: days, };
        minimumPickupDaysMutation.mutate({ payload, });
    };
    return (
        <section className={styles.bookingsettingssection} >
            <p>Configure Minimum Pickup Days</p>
            <section>
                <input
                    type="number"
                    min="1"
                    value={minPickupDays}
                    onChange={(e) => setMinPickupDays(e.target.value)}
                />
                <button
                    type="button"
                    onClick={handleSetMinimumPickupDays}
                    disabled={minimumPickupDaysMutation.isPending}>
                    {minimumPickupDaysMutation.isPending ? "Setting..." : "Set"}
                </button>
            </section>
            {bookingSettingsData && (<span>Minimum delivery delivery day set: <strong>{bookingSettingsData?.minPickupDays} Days </strong></span>)}
        </section>
    );
}


export function AdminAllBookings({ mappedBookingData }: BookingListProp) {
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
    const [isEditBookingStatusId, setIsEditBookingStatusId] = useState<string | null>(null);
    const [newBookingStatus, setNewBookingStatus] = useState<Record<string, BookingStatusDto>>({});

    const updateBookingStatusMutation = useUpdateBookingStatus();

    const cancelledBookings = mappedBookingData.filter((booking) => {
        return booking.status === "CANCELLED"
    })

    const restMappedBookingData = mappedBookingData.filter((booking) => {
        return booking.status !== "CANCELLED"
    })

    const hardDeleteMutation = useHardDeleteBookings();

    const handleDeleteCancelledBookings = () => {
        hardDeleteMutation.mutate()
    }

    const resetBookingStatusEditing = () => {
        setIsEditBookingStatusId(null);
    }
    const handleUpdateBookingStatus = (bookingId: string, payload: BookingStatusPayload) => {
        updateBookingStatusMutation.mutate(
            { bookingId, payload },
            {
                onSuccess: () => {
                    resetBookingStatusEditing();
                }
            }
        )
    }

    return (
        <section className={styles.bookingdetailsection}>
            <span className={styles.allbookingsheader}>
                <span className={styles.headertext}>
                    <h3>All Bookings</h3>

                    <span>Manage customer bookings and appointments</span>
                </span>
                <BookingSettings />

            </span>

            <span className={styles.bookingInfo}>
                <span className={styles.bookingInfoHeader}>
                    <span>Booking ID</span>
                    <span>Customer</span>
                    <span>Service</span>
                    <span>Date Booked</span>
                    <span>Pickup/Delivery Date</span>
                    <span>Delivery Tag</span>
                    <span>Status</span>
                    <span>Amount</span>
                    <span>Assigned Staff</span>
                    <span>Actions</span>
                </span>
                <span className={styles.bookingInfocard}>
                    {restMappedBookingData.map((bookingDetail) => (
                        <span key={bookingDetail.id} className={styles.bookingInfodetails}>
                            <span className={styles.moredetails} onClick={() => setSelectedBooking(bookingDetail)}>{bookingDetail.customBookingId}</span>
                            <span>{bookingDetail.profile?.user?.firstName} {bookingDetail.profile?.user?.lastName}</span>
                            <span>{bookingDetail.service?.name}</span>
                            <span>
                                {bookingDetail.transactions?.[0]?.paidAt
                                    ? formatDateTime(bookingDetail.transactions[0].paidAt)
                                    : "Unpaid"}
                            </span>
                            <span>{formatDateTime(bookingDetail.scheduledDate)}</span>
                            <span>{bookingDetail.deliveryType}</span>
                            <span>
                                {bookingDetail.mappedStatus && (
                                    <span>
                                        {isEditBookingStatusId === bookingDetail.id ? (
                                            <CompanyBookingStatusSelect
                                                id={`booking-status-${bookingDetail.id}`}
                                                currentStatus={
                                                    newBookingStatus[
                                                    bookingDetail.id
                                                    ] ?? (
                                                        bookingDetail.status
                                                    )
                                                }
                                                onStatusChange={(
                                                    newStatus
                                                ) => {
                                                    const selectedStatus = newStatus as BookingStatusDto;
                                                    setNewBookingStatus(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            [bookingDetail.id]:
                                                                selectedStatus
                                                        })
                                                    )
                                                    setIsEditBookingStatusId(null)
                                                    handleUpdateBookingStatus(bookingDetail.id, { status: selectedStatus } as BookingStatusPayload)
                                                }}
                                            />
                                        ) : (
                                            <span className={`${statusMapStyle.status} ${statusMapStyle[statusClassMap[bookingDetail.mappedStatus]]}`} style={{ cursor: "pointer" }} onClick={() => (setIsEditBookingStatusId(bookingDetail.id))}>
                                                {capitalilzeFirstLetter(bookingDetail.mappedStatus)}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </span>
                            <span>{bookingDetail.currency} {bookingDetail.finalAmount}</span>
                            <span>
                                {bookingDetail.assignedTo
                                    ? `${bookingDetail.assignedTo.firstName} ${bookingDetail.assignedTo.lastName}`
                                    : "—"}
                            </span>
                            <span>
                                <button className={styles.editbtn}>
                                    <FiEdit color="blue" />
                                </button>


                            </span>
                        </span>
                    ))}
                    {cancelledBookings?.length > 0 && (
                        <span>
                            <Button text="Delete All Cancelled Bookings" className={styles.cancelledbookingsDeletebtn} onClick={handleDeleteCancelledBookings} />
                        </span>
                    )}

                    {cancelledBookings.map((bookingDetail) => (
                        <span key={bookingDetail.id} className={styles.bookingInfodetails}>
                            <span className={styles.moredetails} onClick={() => setSelectedBooking(bookingDetail)}>{bookingDetail.customBookingId}</span>
                            <span>{bookingDetail.profile?.user?.firstName} {bookingDetail.profile?.user?.lastName}</span>
                            <span>{bookingDetail.service?.name}</span>
                            <span>
                                {bookingDetail.transactions?.[0]?.paidAt
                                    ? formatDateTime(bookingDetail.transactions[0].paidAt)
                                    : "Unpaid"}
                            </span>
                            <span>{formatDateTime(bookingDetail.scheduledDate)}</span>
                            <span>{bookingDetail.deliveryType}</span>
                            <span>{bookingDetail.status}</span>
                            <span>{bookingDetail.currency} {bookingDetail.finalAmount}</span>
                            <span>
                                {bookingDetail.assignedTo
                                    ? `${bookingDetail.assignedTo.firstName} ${bookingDetail.assignedTo.lastName}`
                                    : "—"}
                            </span>
                            <span>
                                <button className={styles.editbtn}>
                                    <FiEdit color="blue" />
                                </button>

                            </span>
                        </span>
                    ))}

                </span>


            </span>
            <BookingDetailsOverlay isOpen={selectedBooking !== null} item={selectedBooking} onClose={() => setSelectedBooking(null)} />
        </section>
    )
}

interface BookingDetailsOverlayProps {
    isOpen: boolean;
    item: BookingDto | null;
    onClose: () => void;
}

export function BookingDetailsOverlay({
    isOpen,
    item,
    onClose,
}: BookingDetailsOverlayProps) {
    const { user, setActiveMenu, setBookingInfo } = useCompanyUserMenu();
    const bookingId = item?.id ?? "";
    const bookingRef = (
        user.type === "COMPANYUSER"
            ? user.uiRole === "ADMIN" || user.uiRole === "STAFF"
                ? `/admin/dashboard#payment?bookingId=${bookingId}`
                : `/staff/dashboard#payment?bookingId=${bookingId}`
            : `/user/payment?bookingId=${bookingId}`
    )

    const handleMakePayment = () => {
        if (!item) return;

        setBookingInfo?.({
            bookingId: item.id,
            bookingUserId: item.profile?.userId,
        });

        if (user.uiRole === "ADMIN" || user.uiRole === "STAFF") {
            setActiveMenu("payment");
        }
    };

    if (!isOpen || !item) return null;


    return (
        <div>
            <span className={styles.overlay}></span>
            <span className={styles.bookingOverlay}>
                <button onClick={onClose}>Close</button>
                <span key={item.id} className={styles.bookingoverlayinfo}>
                    <span className={styles.itemspan}><strong>Booking ID: </strong>{item.customBookingId}</span>
                    <span className={styles.itemspan}><strong>Customer: </strong> {item.profile?.user?.firstName} {item.profile?.user?.lastName}</span>
                    <span>{item.profile?.user?.email && (
                        <span className={styles.itemspan}><strong>Email: </strong> {item.profile.user.email}</span>
                    )} </span>
                    <span>{item.profile?.phoneNumber && (
                        <span className={styles.itemspan}><strong>Mobile number: </strong> {item.profile.phoneNumber}</span>
                    )}</span>
                    <span className={styles.itemspan}><strong>Service: </strong> {item.service?.name}</span>
                    <span className={styles.itemspan}><strong>Date Booked: </strong>
                        {item.transactions?.[0]?.paidAt
                            ? formatDateTime(item.transactions[0].paidAt)
                            : <span>Unpaid <Button className={styles.makepayment} text="make payment" onClick={handleMakePayment} href={user.uiRole === "ADMIN" || user.uiRole === "STAFF" ? undefined : bookingRef} /> </span>
                        }
                    </span>
                    <span className={styles.itemspan}><strong>Pickup/Delivery Date: </strong>{formatDateTime(item.scheduledDate)}</span>
                    <span className={styles.itemspan}><strong>Delivery Tag: </strong> {item.deliveryType}</span>
                    {item.dropOffPoint?.name && (
                        <span className={styles.itemspan}><strong>Dropped Off At: </strong> {item.dropOffPoint.name}</span>
                    )}
                    {item.mappedStatus && (<span className={styles.itemspan}><strong>Status: </strong> <span className={`${statusMapStyle.status} ${statusMapStyle[statusClassMap[item.mappedStatus]]}`}>
                        {capitalilzeFirstLetter(item.mappedStatus)}
                    </span></span>)}
                    <span className={styles.itemspan}><strong>Amount: </strong>{item.currency} {item.finalAmount}</span>
                    <span>
                        {user.uiRole === "ADMIN" || user.id === item.assignedToId ? (
                            <span>
                                <strong>Assigned Staff: </strong> {item.assignedTo?.firstName} {item.assignedTo?.lastName}
                            </span>
                        ) : (
                            ""
                        )}
                    </span>
                    <span>{item.discountAmount && (
                        <span className={styles.itemspan}><strong>Discount: </strong>{item.discountAmount}</span>
                    )}
                    </span>
                    <span>{item.weight && (
                        <span className={styles.itemspan}><strong>Weight: </strong> {item.weight}</span>
                    )}
                    </span>
                    <span>{item.itemCount && (
                        <span className={styles.itemspan}><strong>Number of items: </strong> {item.itemCount}</span>
                    )}</span>
                    <span>
                        {user.uiRole === "ADMIN" && (
                            <span className={styles.adminonlyui}>
                                <span>
                                    {item.isActive === true && (
                                        <button>Active</button>
                                    )}
                                </span>
                                <span className={styles.timestamps}>
                                    <span>
                                        {item.createdAt && (
                                            <span className={styles.itemspan}><strong>Created at: </strong> {formatDateTime(item.createdAt)}</span>
                                        )}
                                    </span>
                                    <span>
                                        {item.updatedAt && (
                                            <span className={styles.itemspan}><strong>Updated at: </strong> {formatDateTime(item.updatedAt)}</span>
                                        )}
                                    </span>
                                    <span>
                                        {item.deletedAt && (
                                            <span className={styles.itemspan}><strong>Deleted at: </strong> {formatDateTime(item.deletedAt)}</span>
                                        )}
                                    </span>
                                </span>
                            </span>
                        )}
                    </span>
                </span>
            </span>
        </div>
    )
}

export function ClientBookingDetailsOverlay({
    isOpen,
    item,
    onClose,
}: BookingDetailsOverlayProps) {
    const [bookingIdState, setBookingIdState] = useState<string | number | undefined>(undefined);
    const bookingId = item?.id ?? "";
    const bookingRef = `/user/payment?bookingId=${bookingId}`;

    const handleMakePayment = () => {
        if (!item) return;

        try {
            setBookingIdState(bookingId);
        } catch {
            // ignore
        }
    };

    if (!isOpen || !item) return null;


    return (
        <div>
            <span className={styles.overlay}></span>
            <span className={styles.bookingOverlay}>
                <button onClick={onClose}>Close</button>
                <span key={item.id} className={styles.bookingoverlayinfo}>
                    <span className={styles.itemspan}><strong>Booking ID: </strong>{item.customBookingId}</span>
                    <span className={styles.itemspan}><strong>Customer: </strong> {item.profile?.user?.firstName} {item.profile?.user?.lastName}</span>
                    <span>{item.profile?.user?.email && (
                        <span className={styles.itemspan}><strong>Email: </strong> {item.profile.user.email}</span>
                    )} </span>
                    <span>{item.profile?.phoneNumber && (
                        <span className={styles.itemspan}><strong>Mobile number: </strong> {item.profile.phoneNumber}</span>
                    )}</span>
                    <span className={styles.itemspan}><strong>Service: </strong> {item.service?.name}</span>
                    <span className={styles.itemspan}><strong>Date Booked: </strong>
                        {item.transactions?.[0]?.paidAt
                            ? formatDateTime(item.transactions[0].paidAt)
                            : <span><Button className={styles.makepayment} text="make payment" onClick={handleMakePayment} href={
                                bookingIdState
                                    ? bookingRef
                                    : undefined
                            } /> </span>
                        }
                    </span>
                    <span className={styles.itemspan}><strong>Pickup/Delivery Date: </strong>{formatDateTime(item.scheduledDate)}</span>
                    <span className={styles.itemspan}><strong>Delivery Tag: </strong> {item.deliveryType}</span>
                    {item.dropOffPoint?.name && (
                        <span className={styles.itemspan}><strong>Dropped Off At: </strong> {item.dropOffPoint.name}</span>
                    )}
                    <span className={styles.itemspan}>{item.mappedStatus && (<span className={styles.itemspan}><strong>Status: </strong> <span className={`${statusMapStyle.status} ${statusMapStyle[statusClassMap[item.mappedStatus]]}`}>
                        {capitalilzeFirstLetter(item.mappedStatus)}
                    </span></span>)}</span>
                    <span className={styles.itemspan}><strong>Amount: </strong>{item.currency} {item.finalAmount}</span>
                    <span>{item.discountAmount && (
                        <span className={styles.itemspan}><strong>Discount: </strong>{item.discountAmount}</span>
                    )}
                    </span>
                    <span>{item.weight && (
                        <span className={styles.itemspan}><strong>Weight: </strong> {item.weight}</span>
                    )}
                    </span>
                    <span>{item.itemCount && (
                        <span className={styles.itemspan}><strong>Number of items: </strong> {item.itemCount}</span>
                    )}</span>
                    <span>
                        {item.isActive === true && (
                            <button>Active</button>
                        )}
                    </span>
                </span>
            </span>
        </div>
    )
}


// edit in display table should be for just bookingdetails.status