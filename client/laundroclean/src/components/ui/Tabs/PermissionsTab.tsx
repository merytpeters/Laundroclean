"use client";
import { useState } from "react";

import { PERMISSION_OPTIONS } from "src/types/roles/permissions";
import styles from './PermissionsTab.module.css';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useRoles } from "src/hooks/rolesNpermissions/useRoles";
import { LoadingState } from "../ErrorState/ErrorState";


interface PermissionsSelectProps {
    value: string[];
    onChange: (permissions: string[]) => void;
    name?: string;
    label?: string;
    disabled?: boolean;
}

export function PermissionsSelect({
    value,
    onChange,
    name = "permissions",
    label = "Permissions",
    disabled = false,
}: PermissionsSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    /*
     * The value contains ONLY actual permissions.
     *
     * Example:
     *
     * [
     *   "user:view",
     *   "user:create",
     *   "service:view"
     * ]
     *
     * We don't store "*" in the value.
     */
    const selectedPermissions = new Set(value);

    const allPermissions =
        PERMISSION_OPTIONS.flatMap(
            (group) => group.permissions
        );

    const isEverythingSelected =
        allPermissions.every(
            (permission) =>
                selectedPermissions.has(
                    permission
                )
        );

    const isEverythingPartiallySelected =
        value.length > 0 && !isEverythingSelected;

    const isFeatureFullySelected = (
        permissions: string[]
    ) => {
        return permissions.every((permission) =>
            selectedPermissions.has(permission)
        );
    };

    const isFeaturePartiallySelected = (
        permissions: string[]
    ) => {
        const selectedCount = permissions.filter(
            (permission) =>
                selectedPermissions.has(permission)
        ).length;

        return (
            selectedCount > 0 &&
            selectedCount < permissions.length
        );
    };

    const togglePermission = (
        permission: string
    ) => {
        const nextPermissions = new Set(
            selectedPermissions
        );

        if (
            nextPermissions.has(permission)
        ) {
            nextPermissions.delete(permission);
        } else {
            nextPermissions.add(permission);
        }

        onChange(
            Array.from(nextPermissions)
        );
    };

    const toggleFeature = (
        permissions: string[]
    ) => {
        const nextPermissions = new Set(
            selectedPermissions
        );

        const allSelected =
            isFeatureFullySelected(
                permissions
            );

        if (allSelected) {
            // Remove all permissions
            // belonging to this feature.
            permissions.forEach(
                (permission) => {
                    nextPermissions.delete(
                        permission
                    );
                }
            );
        } else {
            // Add all permissions
            // belonging to this feature.
            permissions.forEach(
                (permission) => {
                    nextPermissions.add(
                        permission
                    );
                }
            );
        }

        onChange(
            Array.from(nextPermissions)
        );
    };

    const toggleAllPermissions = () => {
        const nextPermissions = new Set(
            selectedPermissions
        );

        if (isEverythingSelected) {
            allPermissions.forEach(
                (permission) => {
                    nextPermissions.delete(
                        permission
                    );
                }
            );
        } else {
            allPermissions.forEach(
                (permission) => {
                    nextPermissions.add(
                        permission
                    );
                }
            );
        }

        onChange(
            Array.from(nextPermissions)
        );
    };

    const selectedCount = value.length;

    return (
        <div className={styles.field}>
            <label htmlFor={name}>
                {label}
            </label>

            <div className={styles.dropdown}>
                <button
                    type="button"
                    id={name}
                    disabled={disabled}
                    className={
                        styles.dropdownButton
                    }
                    onClick={() =>
                        setIsOpen(
                            (previous) =>
                                !previous
                        )
                    }
                >
                    <span>
                        {selectedCount === 0
                            ? "Select permissions"
                            : `${selectedCount} permission${selectedCount !==
                                1
                                ? "s"
                                : ""
                            } selected`}
                    </span>

                    <span
                        className={
                            styles.arrow
                        }
                    >
                        {isOpen ? "▲" : "▼"}
                    </span>
                </button>

                {isOpen && (
                    <div
                        className={
                            styles.dropdownMenu
                        }
                    >
                        <label className={styles.allOption}>
                            <input
                                type="checkbox"
                                checked={isEverythingSelected}
                                ref={(
                                    element
                                ) => {
                                    if (element) {
                                        element.indeterminate =
                                            isEverythingPartiallySelected;
                                    }
                                }}
                                onChange={
                                    toggleAllPermissions
                                }
                            />
                            <span>
                                * All permissions
                            </span>
                        </label>
                        {PERMISSION_OPTIONS.map(
                            (group) => {
                                const allSelected =
                                    isFeatureFullySelected(
                                        group.permissions
                                    );

                                const partiallySelected =
                                    isFeaturePartiallySelected(
                                        group.permissions
                                    );

                                return (
                                    <div
                                        key={
                                            group.feature
                                        }
                                        className={
                                            styles.permissionGroup
                                        }
                                    >
                                        {/* Feature / ALL */}
                                        <label
                                            className={
                                                styles.featureOption
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    allSelected
                                                }
                                                ref={(
                                                    element
                                                ) => {
                                                    if (
                                                        element
                                                    ) {
                                                        element.indeterminate =
                                                            partiallySelected;
                                                    }
                                                }}
                                                onChange={() =>
                                                    toggleFeature(
                                                        group.permissions
                                                    )
                                                }
                                            />

                                            <span>
                                                *
                                                {" "}
                                                All{" "}
                                                {
                                                    group.feature
                                                }
                                            </span>
                                        </label>

                                        {/* Individual permissions */}
                                        <div
                                            className={
                                                styles.permissionList
                                            }
                                        >
                                            {group.permissions.map(
                                                (
                                                    permission
                                                ) => (
                                                    <label
                                                        key={
                                                            permission
                                                        }
                                                        className={
                                                            styles.permissionOption
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.has(
                                                                permission
                                                            )}
                                                            onChange={() =>
                                                                togglePermission(
                                                                    permission
                                                                )
                                                            }
                                                        />

                                                        <span>
                                                            {
                                                                permission
                                                            }
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PermissionsTab() {

    const [permissions, setPermissions] =
        useState<string[]>([]);
    const [morePermissions, setMorePermission] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { data, isLoading } = useRoles()

    if (isLoading) return <LoadingState />

    const rolesObj = data?.data?.roles ?? [];

    return (
        <section className={styles.permissionsTabContainer}>
            <h3>Roles and Permissions</h3>
            {rolesObj?.map((roleObj) => (
                <section className={styles.rolepermissionssection} key={roleObj.id}>
                    {!isEditing ? (
                        <span className={styles.roleobjdisplay}>
                            <span><b>{roleObj.title}</b></span>
                            <span>Level: {roleObj.level}</span>
                            <section className={styles.permissionitemsection}><b>
                                <span className={styles.permissionsitem}>
                                {roleObj.permissions?.slice(0, 5).map((permission, index) => (
                                    <span key={index}>{permission}</span>

                                ))}
                                </span>
                                {!morePermissions && roleObj.permissions?.length !== undefined && roleObj.permissions.length > 5 && (
                                    <button
                                        type="button"
                                        //onClick={}  go to permissions tab
                                        style={{ backgroundColor: "blue", cursor: "pointer", border: "none", fontSize: "small" }}
                                        onClick={() => setMorePermission(true)}
                                    >
                                        view all permissions for this role
                                    </button>
                                )}
                                <span className={styles.permissionsitem}>
                                {morePermissions && roleObj.permissions?.slice(5).map((permission, index) => (

                                    <span key={index}>{permission}</span>
                                ))}
                                </span>
                                {morePermissions && roleObj.permissions?.length !== undefined && (
                                    <button
                                        type="button"
                                        //onClick={}  go to permissions tab
                                        style={{ backgroundColor: "red", cursor: "pointer", border: "none", fontSize: "small" }}
                                        onClick={() => setMorePermission(false)}
                                    >
                                        close
                                    </button>
                                )}
                                </b>

                            </section>


                            <span><FiEdit color="blue" onClick={() => setIsEditing(true)} size={15}/> <FiTrash2 color="red" size={15}/></span>

                        </span>) : (
                        <span className={styles.roleobjdisplay} key={roleObj.id}>
                            <span><b>{roleObj.title}</b></span>
                            <span>Level: {roleObj.level}</span>
                            <section className={styles.permissionitemsection}><b>
                                <span className={styles.permissionsitem}>
                                {roleObj.permissions?.slice(0, 5).map((permission, index) => (
                                    <span key={index}>{permission}</span>

                                ))}
                                </span>
                                {!morePermissions && roleObj.permissions?.length !== undefined && roleObj.permissions.length > 5 && (
                                    <button
                                        type="button"
                                        //onClick={}  go to permissions tab
                                        style={{ backgroundColor: "blue", cursor: "pointer", border: "none", fontSize: "small" }}
                                        onClick={() => setMorePermission(true)}
                                    >
                                        view all permissions for this role
                                    </button>
                                )}
                                <span className={styles.permissionsitem}>
                                {morePermissions && roleObj.permissions?.slice(5).map((permission, index) => (

                                    <span className={styles.permissionsitem} key={index}><span >{permission}</span></span>
                                ))}
                                </span>

                                {morePermissions && roleObj.permissions?.length !== undefined && (
                                    <button
                                        type="button"
                                        //onClick={}  go to permissions tab
                                        style={{ backgroundColor: "red", cursor: "pointer", border: "none", fontSize: "small" }}
                                        onClick={() => setMorePermission(false)}
                                    >
                                        close
                                    </button>
                                )}
                                <span className={styles.addmoreperm}>

                                    <PermissionsSelect
                                        label="Add more permissions"
                                        value={permissions}
                                        onChange={setPermissions}
                                    />

                                </span>
                                </b>

                            </section>


                            <span className={styles.actionbtns}><button onClick={() => setIsEditing(false)} style={{backgroundColor: "grey"}}>Cancel</button> <button style={{backgroundColor: "green"}}>Save</button> <FiTrash2 color="red" size={23}/></span>

                        </span>
                    )}
                    <hr />
                </section>
            ))}
        </section>
    )
}