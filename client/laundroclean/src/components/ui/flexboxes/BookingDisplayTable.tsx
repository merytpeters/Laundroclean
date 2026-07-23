"use client";
import styles from "./BookingDisplayTable.module.css"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { mapBookingStatus } from "src/types/booking/bookingStatus";
import { BookingDetail } from "src/types/booking/bookingOrder";
import { mappedDelivery } from "src/services/bookingService/bookingMockData";
import { transformFieldInArray } from "src/utils/mapData";


const mappedDetails: BookingDetail[] = transformFieldInArray(mappedDelivery, "status", mapBookingStatus)

export default function BookingDisplayTable () {
    const { user, setActiveMenu } = useCompanyUserMenu();

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
                        {user.uiRole === "ADMIN" && <th>Assigned Staff</th>}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mappedDetails.map((bookingDetail) => (
                        <tr key={bookingDetail.id}>
                            <td className={styles.moredetails}>{bookingDetail.customBookingId}</td>
                            <td>{bookingDetail.customerName}</td>
                            <td>{bookingDetail.serviceType}</td>
                            <td>{bookingDetail.datepaid}</td>
                            <td>{bookingDetail.deliveryDate}</td>
                            <td>{bookingDetail.deliveryType}</td>
                            <td>{bookingDetail.status}</td>
                            <td>{bookingDetail.amount}</td>
                            {user.uiRole === "ADMIN" && (
                                <td>{bookingDetail.assignedStaff ?? '—'}</td>
                            )}
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
        </section>
    )
}