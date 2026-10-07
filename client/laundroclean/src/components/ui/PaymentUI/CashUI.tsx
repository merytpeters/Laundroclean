import { useEffect, useState } from 'react';
import styles from './CashUI.module.css';
import Button from '../Button/Button';
import { useInitiatePayment } from 'src/hooks/paymentChannels/usePayment';
import { useForm } from 'react-hook-form';
import { CashMethodFormValues, PaymentMethodProps } from 'src/types/financialtransactions/payment';
import { mapCurrency } from 'src/types/laundrocleanServices/laundroservices';


export default function CashUI(props: PaymentMethodProps) {
    const initiatePaymentMutation = useInitiatePayment()
    const formData = useForm<CashMethodFormValues>({
        defaultValues: {
            bookingId: props.bookingId,
            userId: props.bookingUserId,
            channel: "CASH",
            provider: "INTERNAL",
            status: "INITIATED",
            amount: Number(props.amount),
            currency: props.currency,
        }
    })

    const handleCashPayment = (values: CashMethodFormValues) => {
        initiatePaymentMutation.mutate({
            payload: values
        })
    }

    console.log("bookingId:", props.bookingId)
    console.log("bookingUserId", props.bookingUserId)
    console.log("Currency:", formData.getValues("currency"))
    console.log("amount:", formData.getValues("amount"))

    const currencyDisplay = mapCurrency(formData.getValues("currency"));
    const amountDisplay = formData.getValues("amount");

    console.log("Currency Display:", currencyDisplay)
    return (
        <section className={styles.cashUIContainer}>
            <form onSubmit={formData.handleSubmit(handleCashPayment)}>
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
                        <label htmlFor="">Currency</label>
                        <input type="text" placeholder={`${currencyDisplay}`} readOnly/>
                    </span>
                    <span className={styles.cashformitem}>
                        <label htmlFor="">Amount </label>
                        <input type="number" placeholder={`${amountDisplay}`} readOnly/>
                    </span>
                </span>
                <span>
                    <Button type='submit' text='Make payment' className={styles.cashpaymentbtn} />
                </span>
            </form>
        </section>
    )
}
