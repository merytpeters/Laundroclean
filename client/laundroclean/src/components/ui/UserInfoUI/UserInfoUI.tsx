import { FaUserCircle } from "react-icons/fa";
import styles from "./UserInfoUI.module.css";
import Button from "../Button/Button";
import { useState } from "react";

export default function UserInfoUI() {
    const [isOpenOverlay, setIsOpenOverlay] = useState(false);

    return (
        <section className={styles.userinfocontainer}>
            {!isOpenOverlay ? (
                <span className={styles.infomain}>


                    <span className={styles.userdatasection}>
                        <span className={styles.usernames}>
                            <span> first name</span>
                            <span>last name</span>
                            <span className={styles.statustag}> <Button text="active or inactive" className={styles.statustagbtn}/></span>
                        </span>

                        <span className={styles.usericon}>
                            <FaUserCircle size={60} className={styles.avataricon} />
                        </span>
                    </span>
                    <span className={styles.contactInfo}>
                        <span> email</span>
                        <span>phoneNumber</span>
                        <span>role</span>
                    </span>

                    <span className={styles.userAddresses}>
                        <span>address 1</span>
                        <span> address 2</span>
                        <span> city </span>
                        <span>state </span>
                        <span>postalCode</span>
                    </span>

                    <span className={styles.morebtn}>
                        <Button type="button" text="view more" className={styles.viewmore} onClick={() => setIsOpenOverlay(true)} />
                    </span>
                </span>
            ) : (


                <span>
                    <span className={styles.userOverlay}></span>
                    <span className={styles.userdatasectionOverlay}>
                        <span className={styles.userdatasection}>
                            <span className={styles.usernames}>
                                <span> first name</span>
                                <span>last name</span>
                                <span className={styles.statustag}> <Button text="active or inactive" className={styles.statustagbtn}/></span>
                            </span>

                            <span>
                                <FaUserCircle size={100} className={styles.avataricon} />
                            </span>
                        </span>
                        <span className={styles.contactInfo}>
                            <span> email</span>
                            <span>phoneNumber</span>
                        </span>

                        <span className={styles.userAddresses}>
                            <span>address 1</span>
                            <span> address 2</span>
                            <span> city </span>
                            <span>state </span>
                            <span>postalCode</span>
                        </span>

                        <span className={styles.timestamps}>
                            <span>Created at:</span>
                            <span>Last updated:</span>
                            <span> Deleted: </span>
                        </span>
                        <span className={styles.bookingSummary}> 
                            <h4> Booking History summary - For staff booking they made</h4>
                            <span className={styles.bookingSnapShot}>
                                <span>Total bookings made:</span>
                            <span>Total fulfilled order: </span>
                            <span>Cncelled bookings</span>
                            <span>Upcoming booking or Upcoming assigned booking</span>
                            <span>Lifetime spend</span>
                            <span>Average spend</span>
                            <span>Last Booking or last Booking fulfilled: 2days ago</span>
                            </span>
                            
                        </span>
                        <span className={styles.cancelbtncontainer}>
                            <Button type="button" text="Cancel" onClick={() => (setIsOpenOverlay(false))} />
                        </span>
                    </span>
                </span>

            )}
        </section>
    )
}