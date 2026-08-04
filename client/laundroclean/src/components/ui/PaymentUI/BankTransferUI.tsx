"use client";

import { useState } from "react";
import Button from "../Button/Button";
import styles from './BankTransfer.module.css';



interface OpayBankFormProps {
    onClick?: () => void;
}

export function OpayBankForm({ onClick }: OpayBankFormProps) {
    //info needed will be passed from booking form, userId too
    // userName field will be same as customer Name
    const [CompletePayment, setCompletePayment] = useState<boolean>(false)
    return (
        <section className={styles.opaybankformContainer}>
            <form action="">
                <legend><strong>Bank Transfer using Opay</strong></legend>
                <p>
                    <span>Bank: <b>    OPAY</b> </span>
                    <span>Account Name: <b>   Laundroclean</b></span>
                    <span>Account Number: <b>   3834679202</b></span>

                </p>
                <span className={styles.opaybankformrow}>
                    <span className={styles.opaybankitem}>
                        <label htmlFor="customerName">Customer Name</label>
                        <input type="text" />
                    </span>
                    <span className={styles.opaybankitem}>
                        <label htmlFor="userEmail">Email</label>
                        <input type="text" readOnly />
                    </span>
                </span>
                <span className={styles.opaybankformrow}>
                    <span className={styles.opaybankitem}>
                        <label htmlFor="userMobile">Mobile Number</label>
                        <input type="text" placeholder="Please enter a phone number you currently use" />
                    </span>
                    <span className={styles.opaybankitem}>
                        <label htmlFor="Phone number">Phone Number</label>
                        <input type="text" placeholder="Please enter other phone number" />
                    </span>
                </span>
                <span className={styles.opayproofitem}>
                    <PaymentProof />
                </span>
                <span className={styles.opayformactionbtns}>
                    <Button text="Confirm Payment" onClick={() => setCompletePayment(true)} className={styles.initiatePaymentbtn} />
                    <Button text="Cancel" onClick={onClick} type="reset" className={styles.cancelbtn} />
                </span>

                {CompletePayment && (
                    <span>
                        <span className={styles.opaypaymentoverlay}></span>
                        <span className={styles.opaypayment}>
                            <span>
                                <strong>
                                    Ensure you have completed the transfer before clicking &quot;I&apos;ve Made Payment&quot;!!!
                                </strong>

                            </span>
                            <span className={styles.opaypaymentactionbtns}>

                                <Button text="I have made payment" className={styles.opayPaymentbtn} />
                                <Button text="Cancel" onClick={() => setCompletePayment(false)} className={styles.opayPaymentcancelbtn} />

                            </span>

                        </span>
                    </span>
                )}
            </form>
        </section>
    )
}


export function PaymentProof() {
    /**Wait for payment submission get the id then pass to this form data
    Proof goes here */
    return (
        <section className={styles.paymentProofContainer}>
            <label htmlFor="PaymentProof">Add proof of payment here</label>
            <input type="file" accept="image/*, .pdf" />
        </section>
    )
}


interface OtherBankProps {
    onClick?: () => void;
}

export function OtherBanks({ onClick }: OtherBankProps) {
    return (
        <section className={styles.otherbanksContainer}>
            list of other pay, click displays the bank info to pay
            payment made button that then opens the form for sender details and payment proof
            <Button text="Cancel" onClick={onClick} type="reset" className={styles.cancelbtn}/>
        </section>
    )
}

export default function BankTransferUI() {
    const [IsOpay, setIsOpay] = useState<boolean>(false);
    const [OtherBankTransfer, setOtherBankTransafer] = useState<boolean>(false)

    return (
        <section className={styles.banktransferContainer}>
            {
                IsOpay ? (
                    <OpayBankForm onClick={() => setIsOpay(false)} />
                ) : OtherBankTransfer ? (
                    <OtherBanks onClick={() => setOtherBankTransafer(false)} />
                ) : (
                    <section className={styles.banktransferselection}>

                        <Button text="Use Opay" onClick={() => setIsOpay(true)} className={styles.useopaybtn} />
                        <Button text="Other Banks" onClick={() => setOtherBankTransafer(true)} className={styles.otherbanksbtn} />

                    </section>
                )
            }
        </section>
    )
}