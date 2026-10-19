import { mapClientBookingStatus, ACTIVE_STATUS, BookingTrackerProgressCount, statusClassMap, ClientBookingOrderSteps, OrderStatusMessage } from "src/types/booking/bookingStatus"
import styles from './ActiveOrder.module.css';
import statusStyles from 'src/components/ui/flexboxes/ScheduleCard.module.css';
import { BookingDto } from "src/types/booking/booking.dto";


interface ActiveOrderProps {
    data: BookingDto[]
}

export default function ActiveOrder(prop: ActiveOrderProps) {

    const mappedDetails: (BookingDto & { progressCount: number; originalStatus: string })[] = prop.data.map((item) => ({
        ...item,
        originalStatus: item.status,
        mappedStatus: mapClientBookingStatus(item.status, { deliveryType: item.deliveryType }),
        progressCount: BookingTrackerProgressCount(item.status),
    }))
    return (
        <>
            {mappedDetails.map((bookingDetails) => {
                if (!ACTIVE_STATUS.includes(bookingDetails.originalStatus)) return null;
                const c = bookingDetails.progressCount ?? 0;
                let currentIndex = 0;
                if (c >= 8) currentIndex = 4;
                else if (c >= 7) currentIndex = 3;
                else if (c >= 6) currentIndex = 2;
                else if (c >= 4) currentIndex = 1;
                else if (c >= 3) currentIndex = 0;
                const message = OrderStatusMessage[currentIndex] ?? '';

                return (
                    <div className={styles.activeordercontainer} key={bookingDetails.id}>
                        <span className={styles.textnstatus}>
                            <b>{message}.</b>
                            <span className={`${styles.status} ${statusStyles[statusClassMap[bookingDetails.status]]}`}>
                                {bookingDetails.mappedStatus}
                            </span>
                        </span>

                        <span>Order #{bookingDetails.customBookingId}</span>

                        <div className={styles.progress}>
                            <div
                                className={styles.progressfill}
                                style={{ width: `${Math.round((bookingDetails.progressCount / 7) * 100)}%` }}
                                aria-valuemin={0}
                                aria-valuemax={7}
                                aria-valuenow={bookingDetails.progressCount}
                            />
                        </div>

                        <div className={styles.progresslabel}>
                            {ClientBookingOrderSteps.map((step, idx) => (
                                <div
                                    key={step}
                                    className={`${styles.step} ${idx === currentIndex ? styles.active : ''}`}>
                                    <span className={styles.steptext}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    )
}