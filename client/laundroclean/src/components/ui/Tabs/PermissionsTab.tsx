"use client";
import { useState } from "react";

import { PERMISSION_OPTIONS } from "src/types/roles/permissions";
import styles from './PermissionsTab.module.css';


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
                            : `${selectedCount} permission${
                                  selectedCount !==
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
    return (
        <section>
            <span>Permissions</span>
            table horinzontal header - update, delete, view, edit
        </section>
    )
}