"use client";

import styles from "./AppHeader.module.css"
import Logo from "../logo";
import { useAuth } from "src/context/AuthContext";
import { FaPen, FaSpinner, FaUserCircle } from "react-icons/fa";
import { useDeleteProfilePic, useUpdateProfilePic } from "src/hooks/profile/useProfile";
import { resizeProfileImage } from "src/utils/resizePic";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AppHeaderProp {
    userButton?: React.ReactNode;
    notificationButton?: React.ReactNode;
    settingsOrControlPanelButton?: React.ReactNode;
    backbutton?: React.ReactNode;
    showProfilePic?: boolean;
}

export default function AppHeader({ userButton, notificationButton, settingsOrControlPanelButton, backbutton, showProfilePic = true }: AppHeaderProp) {
    const { authProfile } = useAuth();
    const uploadProfilepicMutation = useUpdateProfilePic();
    const deleteProfilePicMutation = useDeleteProfilePic();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarContainerRef = useRef<HTMLSpanElement>(null);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);
    const isUploadingAvatar = uploadProfilepicMutation.isPending;
    const isDeletingAvatar = deleteProfilePicMutation.isPending;
    const isAvatarBusy = isUploadingAvatar || isDeletingAvatar;

    useEffect(() => {
        return () => {
            if (localAvatarPreview) {
                URL.revokeObjectURL(localAvatarPreview);
            }
        };
    }, [localAvatarPreview]);

    useEffect(() => {
        if (!authProfile?.updatedAt) return;

        setLocalAvatarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    }, [authProfile?.updatedAt]);

    useEffect(() => {
        if (!isAvatarMenuOpen) return;

        const handleDocumentClick = (event: MouseEvent) => {
            const targetNode = event.target as Node;
            if (!avatarContainerRef.current?.contains(targetNode)) {
                setIsAvatarMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsAvatarMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleDocumentClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isAvatarMenuOpen]);

    const triggerFileInput = () => {
        if (isAvatarBusy) return;
        setIsAvatarMenuOpen(false);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            const resizedFile = await resizeProfileImage(file);
            const previewUrl = URL.createObjectURL(resizedFile);

            setLocalAvatarPreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return previewUrl;
            });

            uploadProfilepicMutation.mutate(resizedFile, {
                onError: () => {
                    setLocalAvatarPreview((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return null;
                    });
                },
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to process profile image");
        } finally {
            e.target.value = "";
        }
    };

    const handleDeleteProfilePic = () => {
        if (isAvatarBusy) return;
        setIsAvatarMenuOpen(false);
        setLocalAvatarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        deleteProfilePicMutation.mutate();
    };

    const handlePenKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsAvatarMenuOpen((prev) => !prev);
        }
    };

    const remoteAvatarUrl = authProfile?.avatarUrl
        ? authProfile.avatarPublicId
            ? `${authProfile.avatarUrl}${authProfile.avatarUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(authProfile.updatedAt)}`
            : authProfile.avatarUrl
        : null;

    const avatarUrl = localAvatarPreview || remoteAvatarUrl;

    if (!authProfile) return null;

    return (
        <header className={styles.header}>
            <div className={styles.leftProps}>
                <Logo />
                {userButton}
                {showProfilePic && (
                    <span
                        ref={avatarContainerRef}
                        className={styles.avatarContainer}
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" className={styles.avatarImage} />
                        ) : (
                            <FaUserCircle size={45} className={styles.avatarImage} />
                        )}

                        {isAvatarBusy && (
                            <span className={styles.avatarLoadingOverlay} aria-hidden="true">
                                <FaSpinner size={16} className={styles.spinner} />
                            </span>
                        )}

                        <button
                            type="button"
                            className={styles.penicon}
                            disabled={isAvatarBusy}
                            onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
                            onKeyDown={handlePenKeyDown}
                            aria-label="Profile picture options"
                            title="Profile picture options"
                        >
                            <FaPen size={14} />
                        </button>

                        {isAvatarMenuOpen && (
                            <div className={styles.avatarMenu}>
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className={styles.uploadnewbtn}
                                    disabled={isAvatarBusy}
                                >
                                    {isUploadingAvatar ? "Uploading..." : "Upload new"}
                                </button>
                                {avatarUrl && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteProfilePic}
                                        className={styles.deleteavatarbtn}
                                        disabled={isAvatarBusy}
                                    >
                                        {isDeletingAvatar ? "Removing..." : "Remove"}
                                    </button>
                                )}
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </span>
                )}
            </div>
            <div className={styles.rightProps}>
                {notificationButton}
                {settingsOrControlPanelButton}
                {backbutton}
            </div>
        </header>
    );
}