import { ClientBookingStatusDropDownOptions } from "src/types/booking/bookingStatus";
import styles from "../../../PaymentUI/CurrencySelector.module.css";
import { BookingStatusDto, ClientBookingStatusDto } from "src/types/booking/booking.dto";

interface BookingStatusSelectProps {
    currentStatus: BookingStatusDto
    onStatusChange: (newStatus: ClientBookingStatusDto) => void
    className?: string;
    id?: string;
}

export default function BookingStatusSelect({
    currentStatus,
    onStatusChange,
    className = "",
    id = "booking-status-select"
}: BookingStatusSelectProps) {
    return (
        <div className={`${styles.currencySelectWrapper} ${className}`}>
            <label htmlFor="global-currency-select">
                Select Booking Status
            </label>
            <select 
                name=""
                id={id}
                value={currentStatus}
                onChange={(e) => onStatusChange(e.target.value as ClientBookingStatusDto)}
                className={styles.currencyDropdown}
                >
                    {ClientBookingStatusDropDownOptions.map((currency) => (
                        <option value={currency.value} key={currency.value}>
                            {currency.label}
                        </option>
                    ))}
                </select>
        </div>
    )
}