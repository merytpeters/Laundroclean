"use client";

import Button from "src/components/ui/Button/Button";
import styles from './RolesTab.module.css';
import { useState } from "react";

import { PermissionsSelect } from "./PermissionsTab";
import { useCreateRole } from "src/hooks/rolesNpermissions/useRoles";

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


export default function RolesTab() {
    const [isCreateRole, setIsCreateRole] = useState<boolean>(false);

    const createRoleMutation = useCreateRole(); 

    return (
        <section className={styles.roletabContainer}>

            <span className={styles.actionbtn}>
                <Button text="Create new role" className={styles.newrolebtn} onClick={() => setIsCreateRole(true)} />
            </span>

            {isCreateRole && (
                <span>

                    <span className={styles.createformOverlay}></span>

                    <span className={styles.createformsection}>

                    
                    <span className={styles.cancelbtnspan}>
                        <Button text="Cancel" type="reset" onClick={() => setIsCreateRole(false)} className={styles.cancelbtn}/>
                    </span>

                    <CreateRoleForm
                        title="Create Role"
                        subtitle="Create a role and assign its permissions."
                        onSubmit={(data) => {
                            createRoleMutation.mutate({payload: data});
                        }}
                        actions={
                            <button type="submit" className={styles.createrolebtn}>
                                Create Role
                            </button>
                        }
                    />
                    </span>
                </span>
            )}




            <h3> All Roles</h3>

            <p>Edit, add permissions and deactivate roles</p>
            <section>


                Role lists - edit, deactivate toggle, add permissions to role
                <hr />

                staff list for each role add, remove staff from each role
            </section>


        </section>
    )
}