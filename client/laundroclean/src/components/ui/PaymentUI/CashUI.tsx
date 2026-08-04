import { useState } from 'react';
import styles from './CashUI.module.css';
import CurrencySelect from './CurrencySelect';
import Button from '../Button/Button';

export default function CashUI() {
    const [currency, setCurrency] = useState<string>('NGN')
    // userid and bookingid will be passed from booking form or response
    return (
        <section className={styles.cashUIContainer}>
            <form action="">
                <legend><strong>Record all cash payments here</strong></legend>
                <span className={styles.cashformrow}>
                    <span className={styles.cashformitem}>
                        <label htmlFor="Payment Provider">Payment Provider</label>
                        <input type="text" placeholder='Internal' readOnly />

                    </span>

                    <span className={styles.cashformitem}>
                        <label htmlFor="">Payment Channel</label>
                        <input type="text" placeholder='Cash' readOnly />
                    </span>

                </span>
                <span className={styles.cashformrow}>
                    <span className={styles.cashformitem}>

                        <CurrencySelect currentCurrency={currency} onCurrencyChange={setCurrency} className={styles.currencyselectitem}/>
                    </span>
                    <span className={styles.cashformitem}>
                        <label htmlFor="">Amount </label>
                        <input type="text" placeholder='Amount' />
                    </span>
                </span>
                <span>
                    <Button text='Make payment' className={styles.cashpaymentbtn}/>
                </span>
            </form>
        </section>
    )
}

/**
 * provider: "PAYSTACK" | "OPAY" | "INTERNAL";
    status: "INITIATED" | "PENDING" | "SUCCESS" | "FAILED" | "REVERSED" | "EXPIRED" | "ABANDONED" | "REFUNDED" | "PARTIALLY_REFUNDED" | "PENDING_VERIFICATION" | "REJECTED";
    amount: number;
    channel: string;
    currency: "DOLLAR" | "NAIRA" | "POUNDS";
 */