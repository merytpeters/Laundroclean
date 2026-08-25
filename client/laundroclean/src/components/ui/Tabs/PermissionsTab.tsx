"use client";
import { useEffect, useState } from "react";

import { PERMISSION_OPTIONS } from "src/types/roles/permissions";
import styles from './PermissionsTab.module.css';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDeleteRole, useRoles } from "src/hooks/rolesNpermissions/useRoles";
import { LoadingState } from "../ErrorState/ErrorState";
import { useSearchParams } from "next/navigation";
import Pagination from "../Pagination/Pagination";


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
     * value can contain either:
     *
     * ["user:view", "user:create"]
     *
     * or:
     *
     * ["*"]
     *
     * "*" means all permissions are selected.
     */

    const allPermissions = PERMISSION_OPTIONS.flatMap(
        (group) => group.permissions
    );

    const hasAllPermission = value.includes("*");

    /*
     * For UI purposes, "*" means every actual
     * permission is selected.
     */
    const selectedPermissions = new Set(
        hasAllPermission
            ? allPermissions
            : value
    );

    const isEverythingSelected =
        hasAllPermission ||
        allPermissions.every((permission) =>
            selectedPermissions.has(permission)
        );

    const isEverythingPartiallySelected =
        !hasAllPermission &&
        value.length > 0 &&
        !isEverythingSelected;

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
        /*
         * If "*" is currently selected and the user
         * clicks an individual permission, convert
         * "*" into the full list first.
         */
        const nextPermissions = new Set(
            hasAllPermission
                ? allPermissions
                : value
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
        /*
         * If "*" is selected, start with all
         * permissions so the user can remove
         * an entire feature.
         */
        const nextPermissions = new Set(
            hasAllPermission
                ? allPermissions
                : value
        );

        const allSelected =
            isFeatureFullySelected(
                permissions
            );

        if (allSelected) {
            // Remove all permissions belonging
            // to this feature.
            permissions.forEach(
                (permission) => {
                    nextPermissions.delete(
                        permission
                    );
                }
            );
        } else {
            // Add all permissions belonging
            // to this feature.
            permissions.forEach(
                (permission) => {
                    nextPermissions.add(
                        permission
                    );
                }
            );
        }

        /*
         * If every permission is now selected,
         * store "*" instead of storing every
         * individual permission.
         */
        if (
            nextPermissions.size ===
            allPermissions.length
        ) {
            onChange(["*"]);
        } else {
            onChange(
                Array.from(nextPermissions)
            );
        }
    };

    const toggleAllPermissions = () => {
        /*
         * If everything is already selected,
         * remove all permissions.
         */
        if (isEverythingSelected) {
            onChange([]);
            return;
        }

        /*
         * "*" is the stored representation of
         * "all permissions".
         */
        onChange(["*"]);
    };

    /*
     * "*" represents all permissions, so display
     * the actual number of permissions rather than
     * "1 permission selected".
     */
    const selectedCount = hasAllPermission
        ? allPermissions.length
        : value.length;

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
                            : `${selectedCount} permission${selectedCount !== 1
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
                        {/* ALL PERMISSIONS */}
                        <label
                            className={
                                styles.allOption
                            }
                        >
                            <input
                                type="checkbox"
                                checked={
                                    isEverythingSelected
                                }
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

                        {/* PERMISSION GROUPS */}
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

type PermissionsTabProps = {
    targetRoleId: number | null;
};

export default function PermissionsTab({
    targetRoleId,
}: PermissionsTabProps) {
    const [permissions, setPermissions] = useState<string[]>([]);
    const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);
    const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
    const deleteRoleMutation = useDeleteRole();

    const searchParams = useSearchParams();

    const page =
        Number(
            searchParams.get("permissionsPage")
        ) || 1;

    const limit =
        Number(
            searchParams.get("permissionsLimit")
        ) || 4;
    const search = searchParams.get("search") || "";

    const queryParams = {
        page,
        limit,
        search,
    };

    const { data, isLoading } = useRoles(queryParams);
    const rolesObj = data?.data ?? [];
    const metaData = data?.meta;

    const handleDeleteRole = (id: number) => {
        deleteRoleMutation.mutate(id);
    }

    useEffect(() => {
        if (targetRoleId === null || isLoading) {
            return;
        }

        const timeout = setTimeout(() => {
            const element = document.getElementById(
                `permission-role-${targetRoleId}`
            );

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, [targetRoleId, isLoading, rolesObj]);



    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <section className={styles.permissionsTabContainer}>
            <h3>Roles and Permissions</h3>

            {rolesObj.map((roleObj) => {
                const isExpanded =
                    expandedRoleId === roleObj.id;

                const isEditing =
                    editingRoleId === roleObj.id;

                /*
                 * "*" means that this role has
                 * every available permission.
                 */
                const hasAllPermissions =
                    roleObj.permissions?.includes("*") ?? false;

                /*
                 * Convert "*" into the actual list of
                 * permissions for display purposes.
                 */
                const selectedRolePermissions = new Set(
                    hasAllPermissions
                        ? PERMISSION_OPTIONS.flatMap(
                            (group) => group.permissions
                        )
                        : roleObj.permissions ?? []
                );

                /*
                 * Only show feature groups that have
                 * at least one permission assigned
                 * to this role.
                 */
                const permissionGroups =
                    PERMISSION_OPTIONS.filter((group) =>
                        group.permissions.some((permission) =>
                            selectedRolePermissions.has(
                                permission
                            )
                        )
                    );

                /*
                 * Initially show 5 feature groups.
                 * "View all" expands only this role.
                 */
                const visiblePermissionGroups =
                    isExpanded
                        ? permissionGroups
                        : permissionGroups.slice(0, 5);

                return (
                    <section
                        className={
                            styles.rolepermissionssection
                        }
                        key={roleObj.id}
                    >
                        {!isEditing ? (
                            /*
                             * DISPLAY MODE
                             */
                            <div
                                className={
                                    styles.roleobjdisplay
                                }
                                id={`permission-role-${roleObj.id}`}
                            >
                                {/* Role information */}
                                <div>
                                    <b>{roleObj.title}</b>
                                </div>

                                <div>
                                    Level: {roleObj.level}
                                </div>

                                {/* Permissions table */}
                                <section
                                    className={
                                        styles.permissionitemsection
                                    }
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse:
                                                "collapse",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "10px",
                                                        borderBottom:
                                                            "1px solid #ddd",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    Features
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "10px",
                                                        borderBottom:
                                                            "1px solid #ddd",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    Permissions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {visiblePermissionGroups.map(
                                                (group) => {
                                                    const selectedPermissions =
                                                        group.permissions.filter(
                                                            (
                                                                permission
                                                            ) =>
                                                                selectedRolePermissions.has(
                                                                    permission
                                                                )
                                                        );

                                                    const isFeatureFullySelected =
                                                        selectedPermissions.length ===
                                                        group
                                                            .permissions
                                                            .length;

                                                    return (
                                                        <tr
                                                            key={
                                                                group.feature
                                                            }
                                                        >
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "10px",
                                                                    verticalAlign:
                                                                        "top",
                                                                    borderBottom:
                                                                        "1px solid #eee",
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {isFeatureFullySelected
                                                                    ? `* All ${group.feature}`
                                                                    : group.feature}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "10px",
                                                                    borderBottom:
                                                                        "1px solid #eee",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        flexWrap:
                                                                            "wrap",
                                                                        gap: "6px",
                                                                    }}
                                                                >
                                                                    {selectedPermissions.map(
                                                                        (
                                                                            permission
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    permission
                                                                                }
                                                                                style={{
                                                                                    padding:
                                                                                        "4px 8px",
                                                                                    backgroundColor:
                                                                                        "#f3f4f6",
                                                                                    borderRadius:
                                                                                        "4px",
                                                                                    fontSize:
                                                                                        "13px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    permission
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>

                                    {/* View all */}
                                    {!isExpanded &&
                                        permissionGroups.length >
                                        5 && (
                                            <button
                                                type="button"

                                                onClick={() =>
                                                    setExpandedRoleId(
                                                        roleObj.id
                                                    )
                                                }
                                                className={styles.viewmoreperm}
                                            >
                                                view all
                                                permissions for
                                                this role
                                            </button>
                                        )}

                                    {/* Close */}
                                    {isExpanded && (
                                        <button
                                            type="button"
                                            style={{
                                                backgroundColor:
                                                    "red",
                                                color: "white",
                                                cursor:
                                                    "pointer",
                                                border: "none",
                                                fontSize:
                                                    "small",
                                                padding:
                                                    "4px 8px",
                                                borderRadius:
                                                    "4px",
                                                marginTop:
                                                    "10px",
                                            }}
                                            onClick={() =>
                                                setExpandedRoleId(
                                                    null
                                                )
                                            }
                                        >
                                            close
                                        </button>
                                    )}
                                </section>

                                {/* Actions */}
                                <div className={
                                    styles.actionbtns
                                }>
                                    <FiEdit
                                        color="blue"
                                        size={15}
                                        style={{
                                            cursor:
                                                "pointer",
                                            marginRight:
                                                "10px",
                                        }}
                                        onClick={() => {
                                            setEditingRoleId(
                                                roleObj.id
                                            );

                                            setPermissions(
                                                roleObj.permissions ??
                                                []
                                            );
                                        }}
                                    />

                                    <FiTrash2
                                        color="red"
                                        size={15}
                                        style={{
                                            cursor:
                                                "pointer",
                                        }}
                                        onClick={() => handleDeleteRole(roleObj.id)}
                                    />
                                </div>
                            </div>
                        ) : (
                            /*
                             * EDIT MODE
                             */
                            <div
                                className={
                                    styles.roleobjdisplay
                                }
                            >
                                {/* Role information */}
                                <div>
                                    <b>{roleObj.title}</b>
                                </div>

                                <div>
                                    Level: {roleObj.level}
                                </div>

                                {/* Existing permissions */}
                                <section
                                    className={
                                        styles.permissionitemsection
                                    }
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse:
                                                "collapse",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "10px",
                                                        borderBottom:
                                                            "1px solid #ddd",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    Features
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "10px",
                                                        borderBottom:
                                                            "1px solid #ddd",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    Permissions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {visiblePermissionGroups.map(
                                                (group) => {
                                                    const selectedPermissions =
                                                        group.permissions.filter(
                                                            (
                                                                permission
                                                            ) =>
                                                                selectedRolePermissions.has(
                                                                    permission
                                                                )
                                                        );

                                                    const isFeatureFullySelected =
                                                        selectedPermissions.length ===
                                                        group
                                                            .permissions
                                                            .length;

                                                    return (
                                                        <tr
                                                            key={
                                                                group.feature
                                                            }
                                                        >
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "10px",
                                                                    verticalAlign:
                                                                        "top",
                                                                    borderBottom:
                                                                        "1px solid #eee",
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {isFeatureFullySelected
                                                                    ? `* All ${group.feature}`
                                                                    : group.feature}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    padding:
                                                                        "10px",
                                                                    borderBottom:
                                                                        "1px solid #eee",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        flexWrap:
                                                                            "wrap",
                                                                        gap: "6px",
                                                                    }}
                                                                >
                                                                    {selectedPermissions.map(
                                                                        (
                                                                            permission
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    permission
                                                                                }
                                                                                style={{
                                                                                    padding:
                                                                                        "4px 8px",
                                                                                    backgroundColor:
                                                                                        "#f3f4f6",
                                                                                    borderRadius:
                                                                                        "4px",
                                                                                    fontSize:
                                                                                        "13px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    permission
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>

                                    {/* View all while editing */}
                                    {!isExpanded &&
                                        permissionGroups.length >
                                        5 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedRoleId(
                                                        roleObj.id
                                                    )
                                                }
                                                className={styles.viewmoreperm}
                                            >
                                                view all
                                                permissions for
                                                this role
                                            </button>
                                        )}

                                    {/* Close */}
                                    {isExpanded && (
                                        <button
                                            type="button"
                                            style={{
                                                backgroundColor:
                                                    "red",
                                                color: "white",
                                                cursor:
                                                    "pointer",
                                                border: "none",
                                                fontSize:
                                                    "small",
                                                padding:
                                                    "4px 8px",
                                                borderRadius:
                                                    "4px",
                                                marginTop:
                                                    "10px",
                                            }}
                                            onClick={() =>
                                                setExpandedRoleId(
                                                    null
                                                )
                                            }
                                        >
                                            close
                                        </button>
                                    )}

                                    {/* Add/Edit permissions */}
                                    <div
                                        className={
                                            styles.addmoreperm
                                        }
                                    >
                                        <PermissionsSelect
                                            label="Add or remove permissions"
                                            value={
                                                permissions
                                            }
                                            onChange={
                                                setPermissions
                                            }
                                        />
                                    </div>
                                </section>

                                {/* Edit actions */}
                                <div
                                    className={
                                        styles.actionbtns
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingRoleId(
                                                null
                                            );
                                            setPermissions(
                                                []
                                            );
                                        }}
                                        style={{
                                            backgroundColor:
                                                "grey",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        style={{
                                            backgroundColor:
                                                "green",
                                            color: "white",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        Save
                                    </button>

                                    <FiTrash2
                                        color="red"
                                        size={23}
                                        style={{
                                            cursor:
                                                "pointer",
                                        }}
                                        onClick={() => handleDeleteRole(roleObj.id)}
                                    />
                                </div>
                            </div>
                        )}

                        <hr />
                    </section>
                );
            })}

            <span className="pagination-global">
                <Pagination
                    totalPages={
                        metaData?.totalPages ?? 1
                    }
                    pageParam="permissionsPage"
                />
            </span>
        </section>
    );
}