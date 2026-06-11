"use client";
import { useState } from "react";
import styles from "./BookingDisplayTable.module.css"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { mapBookingStatus } from "src/types/bookingStatus";
import { BookingDetail } from "src/types/bookingOrder";
import { mappedDelivery } from "src/services/bookingService/bookingMockData";
import { transformFieldInArray } from "src/utils/mapData";


const mappedDetails: BookingDetail[] = transformFieldInArray(mappedDelivery, "status", mapBookingStatus)

export default function BookingDisplayTable () {
    const { user } = useCompanyUserMenu();
    const [expanded, setExpanded] = useState(false);

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
                        {user.role === "ADMIN" && <th>Assigned Staff</th>}
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
                            {user.role === "ADMIN" && (
                                <td>{bookingDetail.assignedStaff ?? '—'}</td>
                            )}
                            <td>
                                <button className={styles.editbtn}>
                                    <FiEdit />
                                </button>
                                {user.role === "ADMIN" && (
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
                <button onClick={() => setExpanded(!expanded)} className={styles.viewmore}>{ expanded ? "view less" : "view more" }</button>
            </div>
        </section>
    )
}