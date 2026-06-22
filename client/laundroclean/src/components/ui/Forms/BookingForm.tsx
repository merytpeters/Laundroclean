import React, { useState, useContext } from 'react';
import styles from './BookingForm.module.css';
import Button from '../Button/Button';
import { mapDeliveryType } from '../../../types/bookingStatus';
import { CompanyUserMenuContext } from 'src/components/layouts/CompanyUser/context/CompanyUserMenuContext';


interface PaymentButtonProps {
    onClose?: () => void;
    onPayLater?: () => void;
    className?: string;
}
function PaymentButton(props: PaymentButtonProps) {
    const context = useContext(CompanyUserMenuContext) as React.ContextType<typeof CompanyUserMenuContext> | undefined;
    const contextUser = context?.user;
    const setActiveMenu = context?.setActiveMenu;

    const typeRoutes: Record<string, string> = {
        CLIENT: "/user/payment",
        COMPANYUSER: "/dashboard"
    };

    const userType = contextUser?.type ?? 'CLIENT';
    const href = typeRoutes[userType] || "/user/payment";

    return (
        <div className={`${props.className ?? ''}`}>
            <div className={styles.paymentbuttoncontainer}>
                {userType === "COMPANYUSER" ? (
                    <Button text='Proceed to payment' className={styles.paynowOrlater}
                        onClick={() => setActiveMenu?.("payment")}
                    ></Button>
                ) : (
                    <Button text='Proceed to payment' className={styles.paynowOrlater}
                        href={href}
                    ></Button>
                )}

                <Button text='Pay Later' className={styles.paynowOrlater} onClick={() => { props.onPayLater?.(); props.onClose?.(); }}></Button>
            </div>
        </div>
    );
}
 
export interface BookingFormProps {
    onSubmit?: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    staffAssignedSlot?: React.ReactNode;
    actions?: React.ReactNode;
    showStaffAssignedSlot?: boolean;
    services?: { id: string; name: string }[];
    user?: {
        email?: string;
        addresses?: { id: string; label?: string; line1?: string; city?: string; state?: string; postcode?: string }[];
    };
    staffOptions?: { id: string; name: string }[];
    deliveryOptions?: { value: string; label: string }[];
}

export default function BookingForm({
    onSubmit,
    staffAssignedSlot,
    actions,
    showStaffAssignedSlot = false,
    services = [],
    user,
    staffOptions,
    deliveryOptions,
}: BookingFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | 'new' | ''>('');
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const deliveryOpts = deliveryOptions ?? (() => {
        const vals = ['PICK_UP', 'DROP_OFF'];
        return vals.map((v) => {
            if (v === '') return { value: '', label: 'Select delivery type' };
            try {
                const label = mapDeliveryType(v);
                return { value: v, label };
            } catch {
                // fallback: make a readable label
                return { value: v, label: v.replace(/_/g, ' ').toLowerCase() };
            }
        });
    })();
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <section className={styles.emailaddresssection}>
                <div className={`${styles.field} ${styles.fullWidthField}`}>
                    <label htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" defaultValue={user?.email ?? ''} />
                </div>

                <div className={`${styles.field} ${styles.fullWidthField}`}>
                    <label htmlFor="address_select">Address</label>
                    {user?.addresses && user.addresses.length > 0 ? (
                        <>
                            <select
                                id="address_select"
                                name="address_select"
                                value={selectedAddressId}
                                onChange={(e) => setSelectedAddressId(e.target.value)}
                            >
                                <option value="">Use default / select address</option>
                                {user.addresses.map((a) => (
                                    <option key={a.id} value={a.id}>{a.label ?? a.line1}</option>
                                ))}
                                <option value="new">Add new address</option>
                            </select>

                            {selectedAddressId && selectedAddressId !== 'new' && selectedAddressId !== '' && (
                                <input type="hidden" name="addressId" value={selectedAddressId} />
                            )}
                        </>
                    ) : (
                        /* when user has no saved addresses show the address input fields directly */
                        <div className={styles.newaddress}>
                            <div className={styles.field}>
                                <label htmlFor="address_line1">Line 1</label>
                                <input id="address_line1" name="address_line1" type="text" />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="address_city">City</label>
                                <input id="address_city" name="address_city" type="text" />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="address_state">State</label>
                                <input id="address_state" name="address_state" type="text" />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="address_postcode">Postcode</label>
                                <input id="address_postcode" name="address_postcode" type="text" />
                            </div>
                        </div>
                    )}
                </div>

                {(selectedAddressId === 'new') && (
                    <div className={`${styles.newaddress} ${styles.fullWidthField}`}>
                        <div className={styles.field}>
                            <label htmlFor="address_line1">Line 1</label>
                            <input id="address_line1" name="address_line1" type="text" />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="address_city">City</label>
                            <input id="address_city" name="address_city" type="text" />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="address_state">State</label>
                            <input id="address_state" name="address_state" type="text" />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="address_postcode">Postcode</label>
                            <input id="address_postcode" name="address_postcode" type="text" />
                        </div>
                    </div>
                )}
            </section>

            <section className={styles.servicepromosection}>
                <div className={styles.field}>
                    <label htmlFor="serviceId">Service</label>
                    <select
                        id="serviceId"
                        name="serviceId"
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                    >
                        <option value="">Select service</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="promoCode">Promo code</label>
                    <input id="promoCode" name="promoCode" type="text" />
                </div>
            </section>

            <section className={styles.iteminformationsection}>
                <div className={styles.field}>
                    <label htmlFor="itemCount">Number of items</label>
                    <input id="itemCount" name="itemCount" type="number" />
                </div>

                <div className={styles.field}>
                    <label htmlFor="weight">Weight (kg)</label>
                    <input id="weight" name="weight" type="number" step="0.01" />
                </div>
            </section>

            <section className={styles.deliveryinfosection}>
                <div className={styles.field}>
                    <label htmlFor="deliveryType">Delivery type</label>
                    <select id="deliveryType" name="deliveryType" defaultValue="">
                        {deliveryOpts.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="scheduledDate">Scheduled date</label>
                    <input id="scheduledDate" name="scheduledDate" type="date" />
                </div>

                <div className={`${styles.field} ${styles.fullWidthField}`}>
                    <label htmlFor="pickupTime">Pickup time</label>
                    <input id="pickupTime" name="pickupTime" type="time" />
                </div>

                {/* address is selected/entered above in the email/address section */}
            </section>

            {showStaffAssignedSlot && (
                <section className={styles.staffassignedslot}>
                    {staffAssignedSlot ?? (
                        <>
                            <div className={styles.field}>
                                <label htmlFor="assignedToId">Assign staff</label>
                                <select id="assignedToId" name="assignedToId">
                                    <option value="">Unassigned</option>
                                    {staffOptions?.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="assignedSlotDate">Assigned date</label>
                                <input id="assignedSlotDate" name="assignedSlotDate" type="date" />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="assignedSlotTime">Assigned time</label>
                                <input id="assignedSlotTime" name="assignedSlotTime" type="time" />
                            </div>
                        </>
                    )}
                </section>
            )}

            <section className={styles.specialnotesection}>
                <label htmlFor="additionalNotes">Additional notes</label>
                <textarea id="additionalNotes" name="additionalNotes" rows={4} />
            </section>

            <div className={styles.formactions}>
                {actions ?? (
                    <div className={styles.bookButtonContainer}>
                        <Button text="Book" type="button" className={styles.bookButton} onClick={() => setOpen(true)} />
                        {open && (
                            <PaymentButton onClose={() => setOpen(false)} className={styles.paymentbuttonoverlay} />
                        )}
                    </div>
                )}
            </div>
        </form>
    );
}