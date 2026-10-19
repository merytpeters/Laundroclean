"use client";
import { toast } from 'sonner';
import { FaPlus, FaTimes } from 'react-icons/fa';
import styles from './StaffTab.module.css';
import Button from 'src/components/ui/Button/Button';
import AuthForm, { SelectOption } from 'src/components/ui/Forms/AuthForms';
import { useEffect, useState } from 'react';
import { useRoles } from 'src/hooks/rolesNpermissions/useRoles';
import { LocalSearchBar, FilterSearch } from '../SearchBar/SearchBar';
import { useRegisterUser } from 'src/hooks/auth/useAuth';
import { validatePassword } from 'src/utils/validatePassword';
import UserInfoUI from '../UserInfoUI/UserInfoUI';
import { capitalilzeFirstLetter } from 'src/utils/capitalize';
import { LoadingState } from '../ErrorState/ErrorState';

export default function StaffTab() {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useRoles()
    //console.log("Response object:", data?.data?.roles)

    const [roles, setData] = useState<SelectOption[]>([]);
    useEffect(() => {
        if (data && data.data && data.data) {
            const formattedRoleData = data.data.map((role) => ({
                label: capitalilzeFirstLetter(role.title),
                value: role.title.toLowerCase()
            }))
            setData(formattedRoleData);
        }
    }, [data])

    //console.log("Roles:", roles);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
    })

    const getFields = (handleNameSplit: (value: string) => [string, string]) => [
        {
            label: "Name",
            inputProps: {
                id: "name",
                name: "name",
                type: "text",
                placeholder: "Enter your first and last names",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleNameSplit(e.target.value),
                required: true,
            },
        },
        {
            label: "Email",
            inputProps: {
                id: "email",
                name: "email",
                type: "email",
                placeholder: "Enter your email",
                required: true,
            },
        },
        {
            label: "Password",
            inputProps: {
                id: "password",
                name: "password",
                type: "password",
                placeholder: "Enter your password",
                required: true,
            },
        },
        {
            label: "Role",
            inputProps: {
                id: "role",
                name: "role",
                type: "select",
                required: true,
            },
            options: roles,
        },
    ];

    const handleNameSplit = (val: string): [string, string] => {
        const name = val.trim();
        const index = name.indexOf(' ');

        if (index === -1) {
            const firstName = name;
            const lastName = ''
            setFormData({ ...formData, firstName, lastName });
            return [firstName, lastName]
        } else {
            const firstName = name.substring(0, index)
            const lastName = name.substring(index + 1)
            setFormData({
                ...formData,
                firstName,
                lastName,
            })
            return [firstName, lastName]
        }
    }

    const registerMutation = useRegisterUser();

    const onSubmit: NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]> = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const data = new FormData(e.currentTarget);
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const typedName = String(data.get("name") ?? "").trim();
        const roletitle = String(data.get("role") ?? "").trim();

        const name = [formData.firstName, formData.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() || typedName;

        const pwdError = validatePassword(password);
        if (pwdError) {
            toast.error(pwdError);
            return;
        }

        registerMutation.mutate({
            name,
            email,
            password,
            type: "COMPANYUSER",
            role: {
                title: roletitle
            },
        }, {
            onSuccess(data) {
                toast.success(data?.message);
                form.reset();
                setFormData({ firstName: '', lastName: '' });
                setOpen(false);
            },
        });
    }

    if (isLoading) return <LoadingState />
    return (
        <section className={styles.stafftabContainer}>
            <div className={styles.stafftab}>
                <div className={styles.actionsWrap}>
                    <Button icon={<FaPlus />} text="Add Staff" className={styles.addstaffbtn} onClick={() => setOpen(true)} />

                    {open && <div>
                        <span className={styles.staffregisterOverlay}></span>
                        <div className={`${styles.panel} ${open ? styles.open : ''}`}>

                            <span className={styles.staffsignup}>
                                <span className={styles.cancelbtnwrapper}>
                                    <Button icon={<FaTimes />} text="" className={styles.cancelbtn} onClick={() => setOpen(false)} />
                                </span>


                                <AuthForm
                                    title="Staff Registration"
                                    subtitle="Add a new staff"
                                    fields={getFields(handleNameSplit)}
                                    onSubmit={onSubmit}
                                    actions={
                                        <>
                                            <Button text={registerMutation.isPending ? "Signing Up..." : "Sign Up"} type="submit" className={styles.signupbutton} />
                                        </>
                                    }
                                    className={styles.staffsignupform}
                                />
                            </span>

                            <span> Send staff invite</span>
                        </div>
                    </div>}
                </div>

                <span className={styles.localsearchfilter}>
                    {/*<LocalSearchBar placeholder="Find Staff" />*/}
                    <FilterSearch />
                </span>

            </div>


            <section className={styles.staffInfodetails}>
                <UserInfoUI usertype="COMPANYUSER" />
            </section>


        </section>
    )
}