import { FaUserCircle } from "react-icons/fa";
import styles from "./UserInfoUI.module.css";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import PaymentHistory from "../PaymentUI/PaymentHistory";
import { useAdminGetUsers, useAdminUpdateUserStatus } from "src/hooks/admin/useUser/useUser";
import { LoadingState } from "../ErrorState/ErrorState";
import { capitalilzeFirstLetter } from "src/utils/capitalize";
import { UpdateUserStatusPayload } from "src/types/users/user";
import { formatDateTime } from "src/utils/globalTimezone";


interface UserInfoUIProps {
    usertype: "CLIENT" | "COMPANYUSER";
}

export default function UserInfoUI({ usertype }: UserInfoUIProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const updateUserStatusMutation = useAdminUpdateUserStatus();

    useEffect(() => {
        if (selectedUserId) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }
        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }
    }, [selectedUserId])

    const handleUserStatus = (id: string, payload: UpdateUserStatusPayload) => {
        updateUserStatusMutation.mutate({ id, payload });
    }

    const { data, isLoading, isPending, isError, error } = useAdminGetUsers({ type: usertype });
    /*console.log("COMPONENT:", {
        usertype,
        data,
        isLoading,
        isPending,
        isError,
        error,
    });
    console.log(data)*/
    const userInfoData = data?.data
    // console.log("type:", usertype);
    // console.log("Users: ", userInfoData)

    if (isLoading) return <LoadingState />
    if (!userInfoData) return

    return (
        <section className={styles.userinfocontainer}>
            {userInfoData.map((userInfoDetail) => (
                <span
                    key={userInfoDetail.id}
                    className={styles.userinfodetailbox}
                >
                    {selectedUserId !== userInfoDetail.id ? (
                        <span className={styles.infomain}>
                            <span className={styles.userdatasection}>
                                <span className={styles.usernames}>
                                    {(userInfoDetail.user.firstName || userInfoDetail.user.lastName) && (
                                        <span> <strong>Name:</strong> {userInfoDetail.user.firstName} {userInfoDetail.user.lastName} </span>
                                    )}

                                    <span className={`${styles.statustag} ${userInfoDetail.user.isActive ? styles.statustagactive : styles.statustaginactive}`}>
                                        <Button
                                            text={userInfoDetail.user.isActive ? "active" : "inactive"}
                                            className={styles.statustagbtn}
                                            onClick={() => handleUserStatus(userInfoDetail.userId, { isActive: !userInfoDetail.user.isActive })}
                                        />
                                    </span>
                                </span>

                                <span className={styles.usericon}>
                                    <FaUserCircle
                                        size={60}
                                        className={styles.avataricon}
                                    />
                                </span>
                            </span>

                            {userInfoDetail.user && (<span className={styles.contactInfo}>
                                {userInfoDetail.user.email && (
                                    <span><strong>Email:</strong> {userInfoDetail.user.email}</span>
                                )}


                                {userInfoDetail.phoneNumber && (
                                    <span><strong>Mobile number:</strong> {userInfoDetail.phoneNumber}</span>
                                )}

                                {userInfoDetail.user.role?.title && (
                                    <span><strong>Role:</strong> {capitalilzeFirstLetter(userInfoDetail.user?.role?.title ?? "Add role")}</span>
                                )}

                                {/*<pre>{JSON.stringify(userInfoDetail.user)}</pre>*/}

                            </span>)}

                            <span className={styles.userAddresses}>
                                {userInfoDetail.addressLine1 && (
                                    <span><strong>Address 1:</strong> {userInfoDetail.addressLine1}</span>
                                )}

                                {userInfoDetail.addressLine2 && (
                                    <span><strong>Address 2:</strong> {userInfoDetail.addressLine2}</span>
                                )}

                                {userInfoDetail.city && (
                                    <span><strong>City:</strong> {userInfoDetail.city}</span>
                                )}

                                {userInfoDetail.state && (
                                    <span><strong>State:</strong> {userInfoDetail.state}</span>
                                )}

                                {userInfoDetail.postalCode && (
                                    <span><strong>Postal code:</strong> {userInfoDetail.postalCode}</span>
                                )}
                            </span>

                            <span className={styles.morebtn}>
                                <Button
                                    type="button"
                                    text="view more"
                                    className={styles.viewmore}
                                    onClick={() =>
                                        setSelectedUserId(userInfoDetail.id)
                                    }
                                />
                            </span>
                        </span>
                    ) : (
                        <span>
                            <span className={styles.userOverlay}></span>

                            <span className={styles.userdatasectionOverlay}>
                                <span className={styles.cancelbtncontainer}>
                                    <Button
                                        type="button"
                                        text="Cancel"
                                        onClick={() =>
                                            setSelectedUserId(null)
                                        }
                                    />
                                </span>

                                <span className={styles.userdatasection}>
                                    <span className={styles.usernames}>
                                        {(userInfoDetail.user.firstName || userInfoDetail.user.lastName) && (
                                            <span> <strong>Name:</strong> {userInfoDetail.user.firstName} {userInfoDetail.user.lastName} </span>
                                        )}


                                        <span className={`${styles.statustag} ${userInfoDetail.user.isActive ? styles.statustagactive : styles.statustaginactive}`}>
                                            <Button
                                                text={userInfoDetail.user.isActive ? "active" : "inactive"}
                                                className={styles.statustagbtn}
                                                onClick={() => handleUserStatus(userInfoDetail.userId, { isActive: !userInfoDetail.user.isActive })}
                                            />
                                        </span>
                                    </span>

                                    <span>
                                        <FaUserCircle
                                            size={80}
                                            className={styles.avataricon}
                                        />
                                    </span>
                                </span>

                                {userInfoDetail.user && (<span className={styles.contactInfo}>
                                    {userInfoDetail.user.email && (
                                        <span><strong>Email:</strong> {userInfoDetail.user.email}</span>
                                    )}


                                    {userInfoDetail.phoneNumber && (
                                        <span><strong>Mobile number:</strong> {userInfoDetail.phoneNumber}</span>
                                    )}


                                    {userInfoDetail.user.role?.title && (
                                        <span><strong>Role:</strong> {capitalilzeFirstLetter(userInfoDetail.user?.role?.title ?? "Add role")}</span>
                                    )}
                                    {/*<pre>{JSON.stringify(userInfoDetail.user)}</pre>*/}

                                </span>)}

                                <span className={styles.userAddresses}>
                                    {userInfoDetail.addressLine1 && (
                                        <span><strong>Address 1:</strong> {userInfoDetail.addressLine1}</span>
                                    )}

                                    {userInfoDetail.addressLine2 && (
                                        <span><strong>Address 2:</strong> {userInfoDetail.addressLine2}</span>
                                    )}

                                    {userInfoDetail.city && (
                                        <span><strong>City:</strong> {userInfoDetail.city}</span>
                                    )}

                                    {userInfoDetail.state && (
                                        <span><strong>State:</strong> {userInfoDetail.state}</span>
                                    )}

                                    {userInfoDetail.postalCode && (
                                        <span><strong>Postal code:</strong> {userInfoDetail.postalCode}</span>
                                    )}
                                </span>

                                <span className={styles.timestamps}>
                                    {userInfoDetail.user.createdAt && (
                                        <span>
                                            <strong>Created at:</strong> {formatDateTime(userInfoDetail.user.createdAt)}
                                        </span>
                                    )}

                                    {userInfoDetail.user.updatedAt && (
                                        <span>
                                            <strong>Last updated:</strong> {formatDateTime(userInfoDetail.user.updatedAt)}
                                        </span>
                                    )}

                                    {userInfoDetail.user.deletedAt && (
                                        <span>
                                            <strong>Deleted:</strong> {formatDateTime(userInfoDetail.user.deletedAt)}
                                        </span>
                                    )}

                                </span>

                                <span className={styles.bookingSummary}>
                                    <h4>
                                        Booking History summary - For staff
                                        booking they made
                                    </h4>

                                    <span className={styles.bookingSnapShot}>
                                        <span>
                                            Total bookings made:
                                        </span>

                                        <span>
                                            Total fulfilled order:
                                        </span>

                                        <span>
                                            Cancelled bookings
                                        </span>

                                        <span>
                                            Upcoming booking or Upcoming
                                            assigned booking
                                        </span>

                                        <span>
                                            Lifetime spend
                                        </span>

                                        <span>
                                            Average spend
                                        </span>

                                        <span>
                                            Last Booking or last Booking
                                            fulfilled: 2 days ago
                                        </span>
                                    </span>
                                </span>

                                <span>
                                    All booking and payment history made by
                                    client user
                                </span>

                                <span>
                                    All bookings and payment made by staff
                                    user
                                </span>

                                <span>
                                    <PaymentHistory />

                                    Payment history of the individual,
                                    for staff payment transactions they
                                    carried out
                                </span>
                            </span>
                        </span>
                    )}
                </span>
            ))}
        </section>
    );
}