import styles from './ClientBookingHistory.module.css';
import { bookingReceiptData } from 'src/services/bookingService/bookingMockData';
import { mapCurrencySymbol } from 'src/types/laundrocleanServices/laundroservices';
import { transformFieldInArray } from 'src/utils/mapData';

export default function ClientBookingHistory() {
    const mappedReceiptFields = transformFieldInArray(bookingReceiptData, "currency", mapCurrencySymbol)
    return (
        <>
            <h4 className={styles.pastbookingsheader}>Past Bookings</h4>

            <div className={styles.pastbookingsbox}>
                {mappedReceiptFields.map((receipt) => (
                <span className={styles.pastbookingscard} key={receipt.id}>
                
                    <span className={styles.moredetails}><b>{receipt.customBookingId}</b></span>
                    <span><b>{receipt.serviceType}</b></span>
                    <span><b>Ref Id:</b> {receipt.transactionRef}</span>
                    <span><b>Amount:</b> {receipt.currency}{receipt.paidAmount}</span>
                    <span>
                        {receipt.weight ? (<><b>Weight:</b> {receipt.weight}kg</>) : (<><b>Item Count:</b> {receipt.itemCount}</>)}
                    </span>
                    <span><b>Payment Method:</b> {receipt.channel}</span>
                    <span><b>Payment Provider:</b> {receipt.provider}</span>
                    <span><b>Date Paid:</b> {receipt.paidAt}</span>
                    
            </span>
            ))}
            </div>
        </>
    )
}