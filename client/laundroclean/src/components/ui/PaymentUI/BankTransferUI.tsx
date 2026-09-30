"use client";

import { useState } from "react";
import Button from "../Button/Button";
import styles from './BankTransfer.module.css';
import { BankAccountDto } from "src/types/paymentChannels/bankAccount.dto";
import { useBankAccounts } from "src/hooks/paymentChannels/useBankAccount";
import { ActiveBankAccountSelector } from "../PaymentNBillingUI/bankAccountUI";



interface BankFormProps {
    onClick?: () => void;
    selectedBankData?: BankAccountDto;
}

export function OpayBankForm({ onClick, selectedBankData }: BankFormProps) {
    //info needed will be passed from booking form, userId too
    // userName field will be same as customer Name
    const [CompletePayment, setCompletePayment] = useState<boolean>(false)
    return (
        <section className={styles.opaybankformContainer}>
            <form action="">
                <legend><strong>Bank Transfer using Opay</strong></legend>
                <p>
                    <span>Bank: <b>    {selectedBankData?.bankName}</b> </span>
                    <span>Account Name: <b>   {selectedBankData?.accountName}</b></span>
                    <span>Account Number: <b>  {selectedBankData?.accountNumber}</b></span>

                </p>
                <span className={styles.opaybankformrow}>
                    <span className={styles.opaybankitem}>
                        <label htmlFor="customerName">Customer Name</label>
                        <input type="text" placeholder="Enter account name payment was made from"/>
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


export function BankForm({ onClick, selectedBankData }: BankFormProps) {
    //info needed will be passed from booking form, userId too
    // userName field will be same as customer Name
    const [CompletePayment, setCompletePayment] = useState<boolean>(false)
    return (
        <section className={styles.opaybankformContainer}>
            <form action="">
                <legend><strong>Bank Transfer using {selectedBankData?.bankName}</strong></legend>
                <p>
                    <span>Bank: <b>    {selectedBankData?.bankName}</b> </span>
                    <span>Account Name: <b>   {selectedBankData?.accountName}</b></span>
                    <span>Account Number: <b>  {selectedBankData?.accountNumber}</b></span>

                </p>
                <span className={styles.opaybankformrow}>
                    <span className={styles.opaybankitem}>
                        <label htmlFor="customerName">Customer Name</label>
                        <input type="text" placeholder="Enter account name payment was made from"/>
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
    bankAccountsData: BankAccountDto[]
}

export function OtherBanks({ onClick, bankAccountsData }: OtherBankProps) {
    const [selectedBank, setSelectedBank] = useState<BankAccountDto| null>(null);

    // console.log("Bank data:", bankAccountsData)

    return (
        <section className={styles.otherbanksContainer}>
            <Button text="X" onClick={onClick} type="reset" className={styles.cancelbtn} />
            <section className={styles.otherbanksContent}>
                {!selectedBank ? (
                <ActiveBankAccountSelector data={bankAccountsData} selectedBank={selectedBank} setSelectedBank={setSelectedBank}/>
            ): (<BankForm selectedBankData={selectedBank} onClick={() => setSelectedBank(null)}/>)}
            </section>
            
            
            
        </section>
    )
}


export default function BankTransferUI() {
    const [IsOpay, setIsOpay] = useState<boolean>(false);
    const [OtherBankTransfer, setOtherBankTransafer] = useState<boolean>(false);

    const { data: bankAccountData } = useBankAccounts({params: {
        isActive: true
    }});

    const bankAccounts = Array.isArray(bankAccountData?.data)
        ? bankAccountData.data
        : []

    const opayBankAccount = bankAccounts?.find((bankAccount) => {
        const bankName = bankAccount.bankName
        /*console.log({
            bankName,
            normalized: bankName?.trim().toLowerCase(),
            matches: bankName?.trim().toLowerCase() === "opay",
        })*/
        return bankName?.trim().toLowerCase() === "opay"
            || bankName?.trim().toLowerCase() === "opay digital services limited"
    });

    const otherBankAccounts = bankAccounts?.filter((bankAccount) => {
        const bankName = bankAccount.bankName
        const notOpay = bankName?.trim().toLowerCase() !== "opay"
        const notOpayLimited = bankName?.trim().toLowerCase() !== "opay digital services limited"
        return notOpay && notOpayLimited
    });
    // console.log("Other Bank accounts:", otherBankAccounts)
    // console.log("OPAY:", opayBankAccount)

    return (
        <section className={styles.banktransferContainer}>
            {
                IsOpay ? (
                    <OpayBankForm onClick={() => setIsOpay(false)} selectedBankData={opayBankAccount} />
                ) : OtherBankTransfer ? (
                    <OtherBanks onClick={() => setOtherBankTransafer(false)} bankAccountsData={otherBankAccounts}/>
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