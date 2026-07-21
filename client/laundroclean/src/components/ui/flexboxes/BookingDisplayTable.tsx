"use client";
import styles from "./BookingDisplayTable.module.css"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { mapBookingStatus } from "src/types/booking/bookingStatus";
import { BookingDetail } from "src/types/booking/bookingOrder";
import { mappedDelivery } from "src/services/bookingService/bookingMockData";
import { transformFieldInArray } from "src/utils/mapData";
import { useState } from "react";


const mappedDetails: BookingDetail[] = transformFieldInArray(mappedDelivery, "status", mapBookingStatus)

export default function BookingDisplayTable() {
    const { user, setActiveMenu } = useCompanyUserMenu();
    const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);

    const roleRoutes = {
        ADMIN: "/admin/controlpanel/bookings",
        STAFF: "/dashboard"
    }

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
                    {mappedDetails.slice(0, 6).map((bookingDetail) => (
                        <tr key={bookingDetail.id}>

                            <td className={styles.moredetails}
                                onClick={() => setSelectedBooking(bookingDetail)}
                            >{bookingDetail.customBookingId}</td>
                            <td>{bookingDetail.firstname} {bookingDetail.lastname}</td>
                            <td>{bookingDetail.serviceType}</td>
                            <td>{bookingDetail.datepaid}</td>
                            <td>{bookingDetail.scheduledDate}</td>
                            <td>{bookingDetail.deliveryType}</td>
                            <td>{bookingDetail.status}</td>
                            <td>{bookingDetail.currency} {bookingDetail.finalAmount}</td>
                            <td>
                                {user.uiRole === "ADMIN" || user.id === bookingDetail.assignedToId ? (
                                    bookingDetail.assignedStaff ?? '—'
                                ) : (
                                    "_"
                                )}
                            </td>
                            <td>
                                <button className={styles.editbtn}>
                                    <FiEdit />
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


export function AdminAllBookings() {
    const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
    return (
        <section className={styles.bookingdetailsection}>
            <h3>All Bookings</h3>
            <span>Manage customer bookings and appointments</span>

            <span className={styles.bookingInfo}>
                {mappedDetails.map((bookingDetail) => (
                    <span key={bookingDetail.id} className={styles.bookingInfodetails}>
                        <span className={styles.moredetails} onClick={() => setSelectedBooking(bookingDetail)}>{bookingDetail.customBookingId}</span>
                        <span>{bookingDetail.firstname} {bookingDetail.lastname}</span>
                        <span>{bookingDetail.serviceType}</span>
                        <span>{bookingDetail.datepaid}</span>
                        <span>{bookingDetail.scheduledDate}</span>
                        <span>{bookingDetail.deliveryType}</span>
                        <span>{bookingDetail.status}</span>
                        <span>{bookingDetail.currency} {bookingDetail.finalAmount}</span>
                        <span>{bookingDetail.assignedStaff ?? '—'}</span>
                        <span>
                            <button className={styles.editbtn}>
                                <FiEdit />
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
    item: BookingDetail | null;
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
                    <span className={styles.itemspan}><strong>Customer: </strong> {item.firstname} {item.lastname}</span>
                    <span>{item.email && (
                        <span className={styles.itemspan}><strong>Email: </strong> {item.email}</span>
                    )} </span>
                    <span>{item.phoneNumber && (
                        <span className={styles.itemspan}><strong>Mobile number: </strong> {item.phoneNumber}</span>
                    )}</span>
                    <span className={styles.itemspan}><strong>Service: </strong> {item.serviceType}</span>
                    <span className={styles.itemspan}><strong>Date Booked: </strong>{item.datepaid}</span>
                    <span className={styles.itemspan}><strong>Pickup/Delivery Date: </strong>{item.scheduledDate}</span>
                    <span className={styles.itemspan}><strong>Delivery Tag: </strong> {item.deliveryType}</span>
                    <span className={styles.itemspan}><strong>Status: </strong> {item.status}</span>
                    <span className={styles.itemspan}><strong>Amount: </strong>{item.currency} {item.finalAmount}</span>
                    <span>
                        {user.uiRole === "ADMIN" || user.id === item.assignedToId ? (
                            <span>
                                <strong>Assigned Staff: </strong> {item.assignedStaff ?? '—'}
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
                                            <span className={styles.itemspan}><strong>Created at: </strong> {item.createdAt}</span>
                                        )}
                                    </span>
                                    <span>
                                        {item.updatedAt && (
                                            <span className={styles.itemspan}><strong>Updated at: </strong> {item.updatedAt}</span>
                                        )}
                                    </span>
                                    <span>
                                        {item.deletedAt && (
                                            <span className={styles.itemspan}><strong>Deleted at: </strong> {item.deletedAt}</span>
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