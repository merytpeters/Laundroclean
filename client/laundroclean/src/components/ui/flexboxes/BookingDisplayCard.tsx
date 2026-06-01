"use client";
import styles from "./BookingDisplayCard.module.css"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCompanyUserMenu } from "src/components/layouts/CompanyUser/context/CompanyUserMenuContext";
import { mapBookingStatus, mapDeliveryType } from "src/types/bookingStatus";
import type { DeliveryType } from "src/types/bookingStatus";


type BookingDetail = {
    id: string;
    bookingId: string;
    customerName: string;
    serviceType: string;
    datepaid: string;
    deliveryDate: string;
    rawDeliveryType?: string;
    deliveryType?: DeliveryType;
    status: string;
    amount: string;
    assignedStaff?: string;
}

const bookingDetails: BookingDetail[] = [
    {
        id: "1",
        bookingId: "BK001",
        customerName: "John Doe",
        serviceType: "Laundry Wash",
        datepaid: "02-05-2026",
        deliveryDate: "10-05-2026",
        rawDeliveryType: "PICK_UP",
        status: "CONFIRMED",
        amount: "5000",
    },
    {
        id: "2",
        bookingId: "BK002",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        rawDeliveryType: "DROP_OFF",
        status: "CONFIRMED",
        amount: "5000",
    }
]

const mappedDelivery: BookingDetail[] = bookingDetails.map((item) => {
    let delivery: DeliveryType | undefined;
    try {
        delivery = item.rawDeliveryType ? mapDeliveryType(item.rawDeliveryType) : undefined;
    } catch {
        delivery = undefined;
    }

    return ({ ...item, deliveryType: delivery } as BookingDetail);
})

const mappedDetails: BookingDetail[] = mappedDelivery.map((item) => ({
    ...item,
    status: mapBookingStatus(item.status, { deliveryType: item?.deliveryType }),
} as BookingDetail))

export default function BookingDisplayCard () {
        
    const { user } = useCompanyUserMenu();
    return (
        <section className={styles.bookingdisplaycard}>
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
                            <td>{bookingDetail.bookingId}</td>
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
        </section>
    )
}