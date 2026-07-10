"use client";

import { useState } from 'react';
import Button from '../Button/Button';
import styles from './settingsUI.module.css';
import { FaUser, FaLock, FaCog, FaCreditCard, FaLandmark, FaUserCircle, FaCamera } from 'react-icons/fa';

export default function SettingsUI() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <section className={styles.uiContainer}>
            <aside>
                <ul>
                    <li>
                        <FaCog size={16} />
                        <span>General Settings</span>
                    </li>
                    <li>
                        <FaUser size={16} />
                        <a href="#profilesettings">
                            <span>Profile Settings</span>
                        </a>
                        
                    </li>
                    <li>
                        <FaLock size={16} />
                        <span>Security & Password</span>
                    </li>
                    <li>
                        <FaLandmark size={16} />

                        <a href="#addresses"><span>
                            Addresses</span></a>
                    </li>
                    <li>
                        <FaCreditCard size={16} />
                        <span>Payment Method</span>
                    </li>
                    <span className={styles.destructiveactionbtns}>

                        <Button text="Log Out" className={styles.logoutbtn}/>

                    <Button text="Delete Account" className={styles.deleteacctbtn}/>

                    </span>
                    
                </ul>
            </aside>
            <section className={styles.pagedisplay}>
                <section className={styles.profilesettings} id="profilesettings">
                    {/**Profile display tenary */}
                    <span className={styles.profilepic}>
                        <span className={styles.profileavatar}>
                            <FaUserCircle size={230} className={styles.avataricon} />

                            <span className={styles.camerabadge}>
                                <FaCamera size={35} className={styles.cameraicon} />
                            </span>
                        </span>

                        <span className={styles.profilepicbtns}>
                            <Button text="Upload New" className={styles.uploadnewbtn} />
                            <Button text="Delete Avatar" className={styles.deleteavatarbtn} />
                        </span>

                    </span>

                    {/** Profile form */}
                    <form action="">
                        <div className={styles.formrowgroup}>
                            <span className={styles.formitem}>
                                <label htmlFor="">First name</label>
                                <input type="text" readOnly={isEditing} />
                            </span>
                            <span className={styles.formitem}>
                                <label htmlFor="">Last name</label>
                                <input type="text" readOnly={isEditing} />
                            </span>
                        </div>
                        <div className={styles.formrowgroup}>
                            <span className={styles.formitem}>
                                <label htmlFor="">Email</label>
                                <input type="text" readOnly={isEditing} />
                            </span>
                            <span className={styles.formitem}>
                                <label htmlFor="">Mobile Number</label>
                                <input type="text" readOnly={isEditing} />
                            </span>
                        </div>
                        <div className={styles.adformrowgroup} id="addresses">
                            <span className={styles.addressformgroup}>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Address 1</label>
                                    <input type="text" readOnly={isEditing} />
                                </span>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Address 2</label>
                                    <input type="text" readOnly={isEditing} />
                                </span>
                            </span>
                            <span className={styles.addressdetails}>
                                <span className={styles.citynstate}>
                                    <span className={styles.formitem}>
                                        <label htmlFor="">City</label>
                                        <input type="text" readOnly={isEditing} />
                                    </span>
                                    <span className={styles.formitem}>
                                        <label htmlFor="">State</label>
                                        <input type="text" readOnly={isEditing} />
                                    </span>

                                </span>

                                <span className={styles.formitem}>
                                    <label htmlFor="">Postal Code</label>
                                    <input type="text" readOnly={isEditing} />
                                </span>
                            </span>
                        </div>
                        <span className={styles.actionbtn}>
                            <Button text="Save Changes" className={styles.savechangesbtn} />
                        </span>  
                    </form>
                </section>
            </section>
        </section>
    )
}