"use client";

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import styles from './settingsUI.module.css';
import { FaUser, FaLock, FaCog, FaCreditCard, FaLandmark, FaUserCircle, FaCamera } from 'react-icons/fa';
import { useChangePassword, useDeleteProfilePic, useSoftDeleteAccount, useUpdateProfile, useUpdateProfilePic } from 'src/hooks/profile/useProfile';
import { ProfileDto, UserDto } from 'src/types/users/user.dto';
import { toast } from 'sonner';
import { resizeProfileImage } from 'src/utils/resizePic';
import { useLogout } from 'src/hooks/auth/useAuth';
import { ChangePasswordPayload } from 'src/types/users/user';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


interface SettingsUIProps {
    user: UserDto;
    profile?: ProfileDto;
}

export default function SettingsUI({ user, profile}: SettingsUIProps) {
    const [isEditing, setIsEditing] = useState(false);
    const updateProfileMutation = useUpdateProfile();
    const uploadProfilepicMutation = useUpdateProfilePic();
    const [selectedFile, setSeletedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoutMutation = useLogout();
    const deleteProfilePicMutation = useDeleteProfilePic();
    const softDeleteAccountMutation = useSoftDeleteAccount();
    const [confirmDestructive, setConfirmDestructive] = useState(false);
    const [currentDisplay, setCurrentDisplay] = useState('');
    const changePasswordMutation = useChangePassword();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = useState('password');


    const formData = useForm<UserDto & ProfileDto>({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            // paymentMethodToken: "",
            // avatarUrl: "",
        }
    })

    useEffect(() => {
        if (user && profile) {
            const userprofile = { ...user, ...profile }
            formData.reset(userprofile);
        }
    }, [user, profile, formData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSeletedFile(file);
    }

    const handleSave = async () => {
        if (!selectedFile) return;

        try {
            const resizedFile = await resizeProfileImage(selectedFile);
            uploadProfilepicMutation.mutate(resizedFile);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to process profile image");
        }
    }

    const onSubmit = (values: UserDto | ProfileDto) => {
        updateProfileMutation.mutate(values);

        handleSave();

        setIsEditing(false);
    }

    const handleLogOut = () => {
        logoutMutation.mutate();
    }

    const handleDeleteProfilePic = () => {
        deleteProfilePicMutation.mutate()
    }

    const handleAccountSoftDelete = () => {
        softDeleteAccountMutation.mutate();
    }

    const passwordFormData = useForm<ChangePasswordPayload>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        }
    })

    const handlePasswordChange = (values: ChangePasswordPayload) => {
        changePasswordMutation.mutate(values);
    }


    return (
        <section className={styles.uiContainer}>
            <aside>
                {/*<span>X</span>*/}
                <ul>
                    <li>
                        <FaCog size={16} />
                        <span>General Settings</span>
                    </li>
                    <li>
                        <FaUser size={16} />
                        <a href="#profilesettings" onClick={() => (setCurrentDisplay('profilesettings'))}>
                            <span>Profile Settings</span>
                        </a>

                    </li>
                    <li>
                        <FaLock size={16} />
                        <a href="#security&password" onClick={() => (setCurrentDisplay('security&password'))}>
                            <span>Security & Password</span>
                        </a>
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

                        <Button type="button" text="Log Out" className={styles.logoutbtn} onClick={() => (handleLogOut())} />

                        {!confirmDestructive ? (<Button text="Delete Account" className={styles.deleteacctbtn} onClick={() => setConfirmDestructive(true)} />

                        ) : (


                            <span>
                                <span className={styles.overlay}></span>
                                <span className={styles.destructiveaction}>

                                    <b>This is a destructive action. Are you sure you want to delete account ? </b>
                                    <span className={styles.confirmationbtns}>
                                        <Button type='button' text='Cancel' className={styles.cancelbtn} onClick={() => setConfirmDestructive(false)} />
                                        <Button type="submit" text="Confirm" className={styles.deleteacctbtn} onClick={() => (handleAccountSoftDelete())} />

                                    </span>

                                </span>
                            </span>
                        )}

                    </span>

                </ul>
            </aside>
            <section className={styles.pagedisplay}>
                {currentDisplay === 'profilesettings' ? (
                    <section className={styles.profilesettings} id="profilesettings">
                        {/**Profile display tenary */}
                        <span className={styles.profilepic}>
                            <span className={styles.profileavatar}>
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="Profile" className={styles.profileImage} />
                                ) : (
                                    <FaUserCircle size={230} className={styles.avataricon} />
                                )}
                                <span className={styles.camerabadge}>
                                    <FaCamera size={35} className={styles.cameraicon} onClick={() => fileInputRef.current?.click()} />
                                </span>
                            </span>

                            <span className={styles.profilepicbtns}>
                                <Button text="Upload New" onClick={() => handleSave()} className={styles.uploadnewbtn} />
                                <Button text="Delete Avatar" onClick={() => handleDeleteProfilePic()} className={styles.deleteavatarbtn} />
                            </span>
                            <input type="file" ref={fileInputRef} accept='image/*' hidden onChange={handleFileChange} />

                        </span>

                        {/** Profile form */}
                        <form onSubmit={formData.handleSubmit(onSubmit)}>
                            <div className={styles.formrowgroup}>
                                <span className={styles.formitem}>
                                    <label htmlFor="">First name</label>
                                    <input type="text" readOnly={!isEditing} {...formData.register("firstName")} />
                                </span>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Last name</label>
                                    <input type="text" readOnly={!isEditing} {...formData.register("lastName")} />
                                </span>
                            </div>
                            <div className={styles.formrowgroup}>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Email</label>
                                    <input type="text" readOnly={!isEditing} {...formData.register("email")} />
                                </span>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Mobile Number</label>
                                    <input type="text" readOnly={!isEditing} {...formData.register("phoneNumber")} />
                                </span>
                            </div>
                            <div className={styles.adformrowgroup} id="addresses">
                                <span className={styles.addressformgroup}>
                                    <span className={styles.formitem}>
                                        <label htmlFor="">Address 1</label>
                                        <input type="text" readOnly={!isEditing} {...formData.register("addressLine1")} />
                                    </span>
                                    <span className={styles.formitem}>
                                        <label htmlFor="">Address 2</label>
                                        <input type="text" readOnly={!isEditing} {...formData.register("addressLine2")} />
                                    </span>
                                </span>
                                <span className={styles.addressdetails}>
                                    <span className={styles.citynstate}>
                                        <span className={styles.formitem}>
                                            <label htmlFor="">City</label>
                                            <input type="text" readOnly={!isEditing} {...formData.register("city")} />
                                        </span>
                                        <span className={styles.formitem}>
                                            <label htmlFor="">State</label>
                                            <input type="text" readOnly={!isEditing} {...formData.register("state")} />
                                        </span>

                                    </span>

                                    <span className={styles.formitem}>
                                        <label htmlFor="">Postal Code</label>
                                        <input type="text" readOnly={!isEditing} {...formData.register("postalCode")} />
                                    </span>
                                </span>
                            </div>
                            {isEditing ? (
                                <span>
                                    <span className={styles.actionbtn}>
                                        <Button type="submit" text="Save Changes" className={styles.savechangesbtn} />
                                    </span>

                                    <span className={styles.actionbtn}>
                                        <Button type="button" text="Cancel" className={styles.cancelbtn} onClick={() => setIsEditing(false)} />
                                    </span>
                                </span>

                            ) : (
                                <span className={styles.actionbtn}>
                                    <Button text="Edit" className={styles.editbtn} onClick={() => setIsEditing(true)} />
                                </span>
                            )
                            }
                        </form>
                    </section>
                ) : currentDisplay === 'security&password' ? (
                    <section className={styles.securitynpassword} id="security&password">
                        <form onSubmit={passwordFormData.handleSubmit(handlePasswordChange)}>
                            <h3>Change Password</h3>
                            <p><b>Choose a New Password </b></p>
                            <span>Enter and confirm new password</span>

                            <div className={styles.securityformgroup}>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Current Password</label>
                                    <span className={styles.passwordWrapper}>
                                        <input type={isPassword ? (showPassword ? "text" : "password") : ""} {...passwordFormData.register("currentPassword")} />
                                        {isPassword && (
                                            <button
                                                type="button"
                                                className={styles.showPasswordButton}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                            </button>
                                        )}
                                    </span>
                                </span>
                                <span className={styles.formitem}>
                                    <label htmlFor="">New Password</label>
                                    <span className={styles.passwordWrapper}>
                                        <input type={isPassword ? (showPassword ? "text" : "password") : ""} />
                                        {isPassword && (
                                            <button
                                                type="button"
                                                className={styles.showPasswordButton}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                            </button>
                                        )}
                                    </span>
                                </span>
                                <span className={styles.formitem}>
                                    <label htmlFor="">Confirm new Password</label>
                                    <span className={styles.passwordWrapper}>
                                        <input type={isPassword ? (showPassword ? "text" : "password") : ""} />
                                        {isPassword && (
                                            <button
                                                type="button"
                                                className={styles.showPasswordButton}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                            </button>
                                        )}
                                    </span>
                                </span>
                                <span className={styles.passwordbtncontainer}>
                                    <Button type='submit' text='Continue' className={styles.passwordchangebtn} />
                                </span>

                            </div>

                        </form>
                    </section>
                ) : (
                    <span> General Settings</span>
                )}
            </section>
        </section>
    )
}