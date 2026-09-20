"use client";

import { FiX, FiPlus, FiToggleRight, FiToggleLeft } from 'react-icons/fi';
import styles from './paymentnbilling.module.css';
import { useState } from 'react';
import Button from '../Button/Button';
import { BankAccountDto } from 'src/types/paymentChannels/bankAccount.dto';
import { Role } from 'src/types/roles/role';
import { useCreateBankAccount } from 'src/hooks/paymentChannels/useBankAccount';
import { BankAccountPayload } from 'src/types/paymentChannels/bankAccount';
import { useForm } from 'react-hook-form';
import { formatDateTime } from 'src/utils/globalTimezone';

export function NewBankAccount() {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [defaultOn, setDefaultOn] = useState<boolean>(false);
    const createBankAccountMutation = useCreateBankAccount();
    const formData = useForm<BankAccountPayload>({
        defaultValues: {
            bankName: "",
            accountName: "",
            accountNumber: "",
            isDefault: defaultOn
        }
    })

    const handleCreateBankAccount = (value: BankAccountPayload) => {
        createBankAccountMutation.mutate(
            { payload: value }
        )
    }

    return (
        <section className={styles.newContainer}>
            <button className={styles.addnewbtn} onClick={() => setShowForm(true)}>
                <span>Add new</span>
                <FiPlus size={30} />
            </button>
            {showForm && (
                <section className={`${styles.drawer} ${showForm ? styles.open : ''}`} role="dialog" aria-hidden={!showForm}>
                    <section className={styles.drawerHeader}>
                        <fieldset>
                            <legend><strong>New Bank Account</strong></legend>
                        </fieldset>

                        <button aria-label="Close" className={styles.drawerClose} onClick={() => setShowForm(false)}>
                            <FiX size={20} />
                        </button>

                    </section>
                    <section className={styles.drawerContent}>
                        <form
                            onSubmit={formData.handleSubmit(handleCreateBankAccount)} className={styles.form}>
                            <section className={styles.requiredsection}>
                                <div className={`${styles.field} ${styles.fullWidthField}`}>
                                    <label htmlFor="bankName">
                                        Bank Name
                                    </label>
                                    <input id="bankName" type="text" {...formData.register("bankName")} />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="accountName">
                                        Account Name
                                    </label>
                                    <input id="accountName" type="text" {...formData.register("accountName")} />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="accountNumber">
                                        Account Number
                                    </label>
                                    <input id="accountNumber" type="text" {...formData.register("accountNumber")} />
                                </div>
                            </section>
                            <section className={styles.togglesection}>
                                <button className={styles.defaulttogglebtn}
                                    type="button"
                                    onClick={() => setDefaultOn(!defaultOn)}>
                                    {defaultOn ? (
                                        <FiToggleRight size={40} color='green' fill='#fff' {...formData.register("isDefault", {
                                            setValueAs: (v) => v === true || v === "true"
                                        })}/>
                                    ) : (
                                        <FiToggleLeft size={40} color='red' fill='#fff' {...formData.register("isDefault", {
                                            setValueAs: (v) => v === false || v === "false"
                                        })}/>
                                    )}
                                </button>
                                <p>{defaultOn ? "default bank" : "make default"}</p>

                            </section>

                            <span className={styles.btncontainer}>
                                <Button
                                    text={createBankAccountMutation.isPending ? "Submitting" : "Submit"}
                                    type='submit'
                                    className={styles.submitbtn}
                                    disabled={
                                        createBankAccountMutation.isPending
                                    }
                                />
                            </span>
                        </form>

                    </section>

                </section>
            )}


        </section>
    )
}

interface AllBankAccountsProps {
    data: BankAccountDto[],
    userUIRole?: Role
}

export function AllBankAccounts({data, userUIRole} : AllBankAccountsProps) {
    return (
        <section className={styles.allpaymentChannelsContainer}>
            <ul>
                {data.map((bankAccount: BankAccountDto) => (
                    <li
                        key={bankAccount.id}
                        className={styles.paymentChannelItem}
                    >
                        <span className={styles.paymentitemfirstline}><span><strong>Bank Name: </strong>  {bankAccount.bankName} </span><span>{bankAccount.isDefault ? (
                            <span className={styles.default}>Default</span>
                        ) : (
                            ""
                        )}
                        {bankAccount.isActive ? (
                            <span className={styles.active}>Active</span>
                        ) : (
                            <span className={styles.inactive}>Inactive</span>
                        )}</span></span>
                        <span><strong>Account Name: </strong>  {bankAccount.accountName}</span>
                        <span><strong>Account Number: </strong>  {bankAccount.accountNumber}</span>
                        
                        {userUIRole === "ADMIN" && (
                            <span className={styles.timestamp}>
                                <span>
                                    <strong>Created on: </strong> {formatDateTime(bankAccount.createdAt)}
                                </span>
                                <span><strong>Updated on: </strong> {formatDateTime(bankAccount.updatedAt)}</span>
                            </span>

                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export function ActiveBankAccountSelector(data: AllBankAccountsProps[], userUIRole: Role, isActive: true) {
    return (
        <section>
            Selector for all active bank accounts for bank transfer
            payment channel
        </section>
    )
}