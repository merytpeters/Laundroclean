"use client"
import styles from './DebitCard.module.css';
import Button from '../Button/Button';
import { useState } from 'react';

interface DebitFormProps {
    setIsOpenDebitForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DebitCardForm({setIsOpenDebitForm}: DebitFormProps) {
    return (
        <form className={styles.debitformcontainer}>
            <legend>
                <strong> Payment Details</strong>
            </legend>
            <span className={styles.debitformcolumn}>


                <span className={styles.debitformrow}>
                    <input type="text" name="" id="" placeholder='CARD NUMBER' />
                    <img src="/img/cardnumbericon.png" alt="" />
                </span>

                <span className={styles.debitformrow}>
                    <input type="text" placeholder='CARD HOLDER NAME' />
                </span>
                <span className={styles.debitformrowcvvdetails}>
                    <span className={styles.debitrowitemmonth}>
                        <input type="text" placeholder='12' />
                    </span>
                    <span className={styles.debitrowitem}>
                        <input type="text" name="" id="" placeholder='2028' />
                    </span>
                    <span className={styles.debitrowitemcvv}>
                        <input type="text" name="" id="" placeholder='CVV' />
                        <img src="/img/cvvcardicon.png" alt="" />
                    </span>
                </span>
                <span className={styles.actionbtns}>
                    <Button text='CONFIRM AND PAY' type='submit' className={styles.paybtn} />
                    <Button type='button' text='Cancel' className={styles.cancelbtn} onClick={() => setIsOpenDebitForm(false)}/>
                </span>
            </span>
        </form>
    )
}



export default function DebitCardUI() {
    const [IsOpenDebitFom, setIsOpenDebitForm] = useState<boolean>(false);

    return (
        <section className={styles.debitcardcontainer}>


            <span className={styles.walletcardcontainer}>
                {!IsOpenDebitFom ? (


                    <span className={styles.wallet}>
                        <img src="/img/cardwallet.png" alt="" onClick={() => setIsOpenDebitForm(true)} width={350} height={350}/>

                    </span>
                ) : (


                    <span className={styles.formopencontainer}>
                        <span className={styles.walletopen}>
                            <img src="/img/cardwalletopen.png" alt="" width={600} height={350}/>
                        </span>
                        

                        <DebitCardForm setIsOpenDebitForm={setIsOpenDebitForm}/>
                    </span>
                )
                }
            </span>



        </section>
    )
}