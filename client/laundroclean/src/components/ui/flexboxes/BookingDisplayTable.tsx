"use client";
import styles from "./BookingDisplayTable.module.css"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { mapBookingStatus, mapDeliveryType } from "src/types/booking/bookingStatus";
import { BookingDetail } from "src/types/booking/bookingOrder";
import { mappedDelivery } from "src/services/bookingService/bookingMockData";
import { transformFieldInArray } from "src/utils/mapData";
import { useState } from "react";
import { formatDateTime } from "src/utils/globalTimezone";
import { useGetbookings, useGetBookingSettings, useSetMinimumPickupDays } from "src/hooks/booking/useBooking";
import { minimumPickupdaysPayload } from "src/types/booking/booking";
import { LoadingState } from "../ErrorState/ErrorState";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
import { BookingDto } from "src/types/booking/booking.dto";


// const mappedDetails: BookingDetail[] = transformFieldInArray(mappedDelivery, "status", mapBookingStatus)
type BookingListProp = {
    mappedBookingData: BookingDto[];
};

export default function BookingDisplayTable({ mappedBookingData }: BookingListProp) {
    const { user, setActiveMenu } = useCompanyUserMenu();
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);

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
                            <td>{bookingDetail.status}</td>
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
                                {user.uiRole === "ADMIN" && (
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
    const { data } = useGetBookingSettings();
    const bookingSettingsData = data?.data;

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
                {mappedBookingData.map((bookingDetail) => (
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

                            <button className={styles.trashbtn}>
                                <FiTrash2 />
                            </button>


                        </span>
                    </span>
                ))}

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
    onClose
}: BookingDetailsOverlayProps) {
    const { user } = useCompanyUserMenu();
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
                            : "Unpaid"}
                    </span>
                    <span className={styles.itemspan}><strong>Pickup/Delivery Date: </strong>{formatDateTime(item.scheduledDate)}</span>
                    <span className={styles.itemspan}><strong>Delivery Tag: </strong> {item.deliveryType}</span>
                    <span className={styles.itemspan}><strong>Status: </strong> {item.status}</span>
                    <span className={styles.itemspan}><strong>Amount: </strong>{item.currency} {item.finalAmount}</span>
                    <span>
                        {user.uiRole === "ADMIN" || user.id === item.assignedToId ? (
                            <span>
                                <strong>Assigned Staff: </strong> {item.assignedTo.firstName} {item.assignedTo.lastName}
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

// edit in display table should be for just bookingdetails.status