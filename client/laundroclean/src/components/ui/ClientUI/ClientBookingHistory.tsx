import { useState } from 'react';
import styles from './ClientBookingHistory.module.css';
import { bookingReceiptData } from 'src/services/bookingService/bookingMockData';
import { BookingDto } from 'src/types/booking/booking.dto';
import { mapCurrencySymbol } from 'src/types/laundrocleanServices/laundroservices';
import { transformFieldInArray } from 'src/utils/mapData';
import { BookingListProp, ClientBookingDetailsOverlay } from '../flexboxes/BookingDisplayTable';
import { formatDateTime } from 'src/utils/globalTimezone';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { capitalilzeFirstLetter } from 'src/utils/capitalize';
import { useCancelBookings } from 'src/hooks/booking/useBooking';

export default function ClientBookingHistory({mappedBookingData} : BookingListProp) {
    
    return (
        <>
            <h4 className={styles.pastbookingsheader}>Past Bookings</h4>
            <p className={styles.pastbookingsheader}>Download or print recepts</p>
            <div className={styles.pastbookingsbox}>
                {mappedBookingData.map((receipt) => (
                <span className={styles.pastbookingscard} key={receipt.id}>
                
                    <span className={styles.moredetails}><b>{receipt.customBookingId}</b></span>
                    <span>{receipt.profile?.user?.firstName} {receipt.profile?.user?.lastName}</span>
                    <span><b>{receipt.service?.name}</b></span>
                    <span><b>Ref Id:</b> {receipt.transactions?.[0].transactionRef}</span>
                    <span><b>Amount:</b> {receipt.currency}{receipt.transactions?.[0].paidAmount}</span>
                    <span>
                        {receipt.weight ? (<><b>Weight:</b> {receipt.weight}kg</>) : (<><b>Item Count:</b> {receipt.itemCount}</>)}
                    </span>
                    <span><b>Payment Method:</b> {receipt.transactions?.[0].payment.channel}</span>
                    <span><b>Payment Provider:</b> {receipt.transactions?.[0].payment.provider}</span>
                    <span><b>Date Paid:</b> {formatDateTime(receipt.transactions?.[0].paidAt)}</span>
                    
            </span>
            ))}
            </div>
        </>
    )
}

export function ClientAllOnGoingBookings({ mappedBookingData }: BookingListProp) {
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);

    const cancelBookingMutation = useCancelBookings();
    const handleCancelBooking = (bookingId: string) => {
        cancelBookingMutation.mutate(bookingId)
    }

    return (
        <section className={styles.CurrentBookingsContainer}>
            <h3>Current Bookings</h3>
            <p>Manage your pending bookings</p>

            <section className={styles.bookingsBody}>

                    <span className={styles.bookingListHeader}>
                        <span>Booking ID</span>
                        <span>Service</span>
                        <span>Paid At</span>
                        <span>Date Created</span>
                        <span>Pickup/Delivery Date</span>
                        <span>Delivery Tag</span>
                        <span>Status</span>
                        <span>Amount</span>
                        <span>Actions</span>
                    </span>
                <span className={styles.bookingsListBody}>
                    {mappedBookingData.slice(0, 6).map((bookingDetail) => (
                        <span key={bookingDetail.id} className={styles.bookingItem}>
                            
                            <span className={styles.moredetails}
                                onClick={() => setSelectedBooking(bookingDetail)}
                            ><strong>{bookingDetail.customBookingId} </strong></span>
                            <span>{bookingDetail.service?.name}</span>
                            <span>
                                {bookingDetail.transactions?.[0]?.paidAt
                                    ? formatDateTime(bookingDetail.transactions[0].paidAt)
                                    : "Unpaid"}
                            </span>
                            <span>{formatDateTime(bookingDetail.createdAt)}</span>
                            <span>{formatDateTime(bookingDetail.scheduledDate)}</span>
                            <span>{bookingDetail.deliveryType}</span>
                            <span>{capitalilzeFirstLetter(bookingDetail.status)}</span>
                            <span>{bookingDetail.currency} {bookingDetail.finalAmount}</span>
                            <span>
                                {bookingDetail.status === "PENDING" && (
                                    <button className={styles.trashbtn}>
                                        <FiTrash2 color="red" onClick={() => {
                                            handleCancelBooking(bookingDetail.id)
                                        }}/>
                                    </button>
                                )}
                            </span>
                        </span>
                    ))}
                </span>

            </section>
                
            <ClientBookingDetailsOverlay isOpen={selectedBooking !== null} item={selectedBooking} onClose={() => setSelectedBooking(null)} />

        </section>
    )
}