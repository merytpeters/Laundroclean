"use client";

import Button from "src/components/ui/Button/Button";
import styles from './RolesTab.module.css';
import { useState } from "react";

import { PermissionsSelect } from "./PermissionsTab";
import { useCreateRole, useRole, useRoles } from "src/hooks/rolesNpermissions/useRoles";
import { FilterSearch } from "../SearchBar/SearchBar";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { LoadingState, TableLoadingState } from "../ErrorState/ErrorState";
import { formatDateTime } from "src/utils/globalTimezone";
import Pagination from "../Pagination/Pagination";
import { useSearchParams } from "next/navigation";

interface CreateRoleFormProps {
    title: string;
    subtitle?: string;
    onSubmit: (data: {
        title: string;
        level: number;
        permissions: string[];
    }) => void;
    actions?: React.ReactNode;
}

export function CreateRoleForm({
    title,
    subtitle,
    onSubmit,
    actions,
}: CreateRoleFormProps) {
    const [roleTitle, setRoleTitle] =
        useState("");

    const [level, setLevel] =
        useState<number>(0);

    const [permissions, setPermissions] =
        useState<string[]>([]);

    const handleSubmit = (
        event: React.SyntheticEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        onSubmit({
            title: roleTitle.trim(),
            level,
            permissions,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <legend>
                <h4>{title}</h4>

                {subtitle && (
                    <p>{subtitle}</p>
                )}
            </legend>

            <div className={styles.field}>
                <label htmlFor="role-title">
                    Role title
                </label>

                <input
                    id="role-title"
                    name="title"
                    type="text"
                    value={roleTitle}
                    onChange={(event) =>
                        setRoleTitle(
                            event.target.value
                        )
                    }
                    placeholder="e.g. Manager"
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="role-level">
                    Level
                </label>

                <input
                    id="role-level"
                    name="level"
                    type="number"
                    min={0}
                    value={level}
                    onChange={(event) =>
                        setLevel(
                            Number(
                                event.target.value
                            )
                        )
                    }
                    required
                />
            </div>
            <span className={styles.permissionSelectitem}>

                <PermissionsSelect
                    value={permissions}
                    onChange={setPermissions}
                />

            </span>


            {actions && (
                <div className={styles.actions}>
                    {actions}
                </div>
            )}
        </form>
    );
}

export function RoleUsers({ roleId }: { roleId: number }) {
    const { data, isLoading } = useRole(roleId);
    if (isLoading) return <TableLoadingState />

    const userRoledata = data?.data?.role.users
    // console.log("Role data:", data?.data?.role)
    // console.log("User Role data:", userRoledata)

    if (userRoledata?.length === 0) return (
        <tbody>
            <tr className={styles.tablebodyrow}>
                <td>Add staff to this role </td>
                <td> List of all staff will show to select</td>
            </tr>
        </tbody>
    )

    return (
        <tbody>
            {userRoledata?.map((user) => (
                <tr key={user.id} className={styles.tablebodyrow}>
                    <td>
                        <input type="checkbox" />
                    </td>
                    <td className={styles.fullnametd}> <FaUserCircle /> {user.firstName} {user.lastName}</td>
                    <td className={styles.emailtd}>{user.email}</td>
                    <td>{user.isActive ? "Active" : "Inactive"}</td>
                    <td className={styles.joineddatetd}>{formatDateTime(user.createdAt)}</td>
                    <td><FiEdit color="blue" /> <FiTrash2 color="red" /> </td>
                </tr>
            ))}

        </tbody>

    )
}

type RolesTabProps = {
    toggleToPermissionTab: (
        roleId: number
    ) => void;
};

export function RoleList({
    toggleToPermissionTab,
}: RolesTabProps) {
    const searchParams = useSearchParams();

    const page =
        Number(
            searchParams.get("rolesPage")
        ) || 1;

    const limit =
        Number(
            searchParams.get("rolesLimit")
        ) || 4;

    const search =
        searchParams.get("search") || "";

    const queryParams = {
        page,
        limit,
        search,
    };

    const {
        data,
        isLoading,
    } = useRoles(queryParams);

    if (isLoading) {
        return <LoadingState />;
    }

    const rolesObj = data?.data ?? [];
    const metaData = data?.meta;

    return (
        <section className={styles.roleList}>
            <span className={styles.filterrole}>
                <FilterSearch />
            </span>

            <section
                className={
                    styles.roleListmapsection
                }
            >
                {rolesObj.map((roleObj) => (
                    <section
                        className={
                            styles.rolelistitem
                        }
                        key={roleObj.id}
                    >
                        <span
                            className={
                                styles.roleinfo
                            }
                        >
                            <b>
                                <span>
                                    {roleObj.title}
                                </span>

                                <span>
                                    Level:{" "}
                                    {roleObj.level}
                                </span>

                                <span
                                    className={
                                        styles.rolepermissionslist
                                    }
                                >
                                    {roleObj.permissions
                                        ?.length !==
                                        undefined && (
                                        <button
                                            type="button"
                                            style={{
                                                backgroundColor:
                                                    "#fff",
                                                cursor:
                                                    "pointer",
                                                border:
                                                    "none",
                                                fontSize:
                                                    "small",
                                            }}
                                            onClick={() =>
                                                toggleToPermissionTab(
                                                    roleObj.id
                                                )
                                            }
                                        >
                                            See all
                                            permissions
                                            for this
                                            role
                                        </button>
                                    )}
                                </span>
                            </b>
                        </span>

                        <table>
                            <thead>
                                <tr
                                    className={
                                        styles.tableheader
                                    }
                                >
                                    <th>
                                        <input
                                            type="checkbox"
                                        />
                                    </th>

                                    <th>
                                        Full Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Joined Date
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <RoleUsers
                                roleId={
                                    roleObj.id
                                }
                            />
                        </table>

                        <hr />
                    </section>
                ))}

                <span className="pagination-global">
                    <Pagination
                        totalPages={
                            metaData?.totalPages ??
                            1
                        }
                        pageParam="rolesPage"
                    />
                </span>
            </section>
        </section>
    );
}

export default function RolesTab({
    toggleToPermissionTab,
}: RolesTabProps) {
    const [isCreateRole, setIsCreateRole] =
        useState<boolean>(false);

    const createRoleMutation =
        useCreateRole();

    return (
        <section
            className={
                styles.roletabContainer
            }
        >
            {isCreateRole && (
                <span>
                    <span
                        className={
                            styles.createformOverlay
                        }
                    />

                    <span
                        className={
                            styles.createformsection
                        }
                    >
                        <span
                            className={
                                styles.cancelbtnspan
                            }
                        >
                            <Button
                                text="Cancel"
                                type="reset"
                                onClick={() =>
                                    setIsCreateRole(
                                        false
                                    )
                                }
                                className={
                                    styles.cancelbtn
                                }
                            />
                        </span>

                        <CreateRoleForm
                            title="Create Role"
                            subtitle="Create a role and assign its permissions."
                            onSubmit={(data) => {
                                createRoleMutation.mutate(
                                    {
                                        payload:
                                            data,
                                    },
                                    {
                                        onSuccess:
                                            () => {
                                                setIsCreateRole(
                                                    false
                                                );
                                            },
                                    }
                                );
                            }}
                            actions={
                                <button
                                    type="submit"
                                    className={
                                        styles.createrolebtn
                                    }
                                >
                                    Create Role
                                </button>
                            }
                        />
                    </span>
                </span>
            )}

            <h3>
                All Roles

                <span
                    className={
                        styles.actionbtn
                    }
                >
                    <Button
                        text="Create new role"
                        className={
                            styles.newrolebtn
                        }
                        onClick={() =>
                            setIsCreateRole(
                                true
                            )
                        }
                    />
                </span>
            </h3>

            <section>
                <RoleList
                    toggleToPermissionTab={
                        toggleToPermissionTab
                    }
                />
            </section>
        </section>
    );
}