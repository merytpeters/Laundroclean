import { useState } from 'react';
import styles from './ClientBookingHistory.module.css';
import { BookingDto, ClientBookingStatusDto } from 'src/types/booking/booking.dto';
import { BookingListProp, ClientBookingDetailsOverlay } from '../flexboxes/BookingDisplayTable';
import { formatDateTime } from 'src/utils/globalTimezone';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useCancelBookings, useUpdateBookingStatus } from 'src/hooks/booking/useBooking';
import statusMapStyle from '../flexboxes/ScheduleCard.module.css'
import { statusClassMap } from 'src/types/booking/bookingStatus';
import BookingStatusSelect from '../Modals/CompanyUser/BookingStatusSelect/BookingStatusSelect';
import { BookingStatusPayload } from 'src/types/booking/booking';
import Logo from '../logo';

export default function ClientBookingHistory({ mappedBookingData }: BookingListProp) {

    return (
        <>
            <h4 className={styles.pastbookingsheader}>Past Bookings</h4>
            <p className={styles.pastbookingsheader}>Download or print recepts</p>
            <div className={styles.pastbookingsbox}>
                {mappedBookingData.map((receipt) => (
                    <span className={styles.pastbookingscard} key={receipt.id}>
                        <span className={styles.laundrocleanlogo}><Logo/></span>
                        <span className={styles.moredetails}><b>{receipt.customBookingId}</b></span>
                        <span>{receipt.profile?.user?.firstName} {receipt.profile?.user?.lastName}</span>
                        <span><b>Service:</b> {receipt.service?.name}</span>
                        <span><b>Ref Id:</b> {receipt.transactions?.[0]?.transactionRef}</span>
                        <span><b>Amount:</b> {receipt.currency}{receipt.transactions?.[0]?.paidAmount}</span>
                        <span>
                            {receipt.weight ? (<><b>Weight:</b> {receipt.weight}kg</>) : (<><b>Item Count:</b> {receipt.itemCount}</>)}
                        </span>
                        <span><b>Payment Method:</b> {receipt.transactions?.[0]?.payment?.[0]?.channel}</span>
                        <span><b>Payment Provider:</b> {receipt.transactions?.[0]?.payment?.[0]?.provider === "INTERNAL" ? (
                            <span>LAUNDROCLEAN</span>
                        ): (
                            <span>{receipt.transactions?.[0]?.payment?.[0]?.provider}</span>
                        )}</span>
                        <span><b>Date Paid:</b> {formatDateTime(receipt.transactions?.[0]?.paidAt)}</span>

                    </span>
                ))}
            </div>
        </>
    )
}

export function ClientAllOnGoingBookings({ mappedBookingData }: BookingListProp) {
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
    const [isEditBookingStatusId, setIsEditBookingStatusId] = useState<string | null>(null);
    const [newBookingStatus, setNewBookingStatus] = useState<Record <string, ClientBookingStatusDto>>({});

    const cancelBookingMutation = useCancelBookings();
    const updateBookingStatusMutation = useUpdateBookingStatus();

    const handleCancelBooking = (bookingId: string) => {
        cancelBookingMutation.mutate(bookingId)
    }

    const resetBookingStatusEditing = () => {
        setIsEditBookingStatusId(null);
    }
    const handleUpdateBookingStatus = (bookingId: string, payload: BookingStatusPayload) => {
        updateBookingStatusMutation.mutate(
            {bookingId, payload},
            {
                onSuccess: () => {
                    resetBookingStatusEditing();
                }
            }
        )
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
                            {bookingDetail.mappedStatus && (
                                <span>
                                    {isEditBookingStatusId === bookingDetail.id ? (
                                        <BookingStatusSelect
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
                                                const selectedStatus = newStatus as ClientBookingStatusDto;
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
                                            {bookingDetail.mappedStatus}
                                        </span>
                                    )}
                                </span>
                            )}
                            <span>{bookingDetail.currency} {bookingDetail.finalAmount}</span>
                            <span>
                                {bookingDetail.status === "PENDING" && (
                                    <button className={styles.trashbtn}>
                                        <FiTrash2 color="red" onClick={() => {
                                            handleCancelBooking(bookingDetail.id)
                                        }} />
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