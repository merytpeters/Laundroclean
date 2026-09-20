"use client";

import { useState } from 'react';
import styles from './paymentnbilling.module.css'
import { FiPlus, FiX } from 'react-icons/fi';
import Button from '../Button/Button';
import { useCreatePOSDevice } from 'src/hooks/paymentChannels/usePOSDevice';
import { useForm } from 'react-hook-form';
import { POSDevicePayload } from 'src/types/paymentChannels/posDevices';
import { POSDeviceDto } from 'src/types/paymentChannels/posDevices.dto';
import { Role } from 'src/types/roles/role';
import { formatDateTime } from 'src/utils/globalTimezone';

export function NewPOSDevice() {
    const [showForm, setShowForm] = useState(false);
    const createPOSDeviceMutation = useCreatePOSDevice();
    const formData = useForm<POSDevicePayload>({
        defaultValues: {
            name: "",
            serialNumber: "",
        }
    })

    const handleCreatePOSDevice = (value: POSDevicePayload) => {
        createPOSDeviceMutation.mutate(
            { payload: value }
        )
    }

    return (
        <section className={styles.newContainer}>
            <button className={styles.addnewbtn} onClick={() => setShowForm(true)}>
                <span>Add new</span>
                <FiPlus size={30} />
            </button>
            <section className={`${styles.drawer} ${showForm ? styles.open : ''}`} role="dialog" aria-hidden={!showForm}>
                <section className={styles.drawerHeader}>
                    <fieldset>
                        <legend><strong>New OPAY POS Device</strong></legend>
                    </fieldset>

                    <button aria-label="Close" className={styles.drawerClose} onClick={() => setShowForm(false)}>
                        <FiX size={20} />
                    </button>

                </section>
                <section className={styles.drawerContent}>
                    <form onSubmit={formData.handleSubmit(handleCreatePOSDevice)} className={styles.form}>
                        <section className={styles.requiredsection}>
                            <div className={`${styles.field} ${styles.fullWidthField}`}>
                                <label htmlFor="name">
                                    Device Name
                                </label>
                                <input id="name" type="text" {...formData.register("name")} />
                            </div>
                            <div className={`${styles.field} ${styles.fullWidthField}`}>
                                <label htmlFor="serialNumber">
                                    Serial Number
                                </label>
                                <input id="serialNumber" type="text" {...formData.register("serialNumber")} />
                            </div>
                        </section>

                        <span className={styles.btncontainer}>
                            <Button
                                text={createPOSDeviceMutation.isPending ? "Submitting": "Submit"}
                                type='submit'
                                className={styles.submitbtn}
                                disabled={
                                    createPOSDeviceMutation.isPending
                                }
                                />
                        </span>



                    </form>

                </section>

            </section>

        </section>
    )
}

interface AllPOSDevicesProps {
    data: POSDeviceDto[],
    userUIRole?: Role
}

export function AllPOSDevices({data, userUIRole}: AllPOSDevicesProps) {
    return (
        <section className={styles.allpaymentChannelsContainer}>
            <ul>
                {data.map((POSdevice: POSDeviceDto) => (
                    <li
                        key={POSdevice.id}
                        className={styles.paymentChannelItem}
                    >
                        <span className={styles.paymentitemfirstline}><span><strong>Device Name: </strong>  {POSdevice.name} </span><span>
                        {POSdevice.isActive ? (
                            <span className={styles.active}>Active</span>
                        ) : (
                            <span className={styles.inactive}>Inactive</span>
                        )}</span></span>
                        <span><strong>Serial Number: </strong>  {POSdevice.serialNumber}</span>
                        
                        {userUIRole === "ADMIN" && (
                            <span className={styles.timestamp}>
                                <span>
                                    <strong>Created on: </strong> {formatDateTime(POSdevice.createdAt)}
                                </span>
                                <span><strong>Updated on: </strong> {formatDateTime(POSdevice.updatedAt)}</span>
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export function ActivePOSDeviceSelector() {
    return (
        <section>
            Selector for all active pos devices for pos
            payment channel
        </section>
    )
}