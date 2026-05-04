"use client";
import { FaPlus } from 'react-icons/fa';
import styles from './StaffTab.module.css';
import Button from 'src/components/ui/Button/Button';
import AuthForm from 'src/components/ui/Forms/AuthForms';
import { useState } from 'react';
import { useRoles } from 'src/app/admin/hooks/roles/useRoles';

export default function StaffTab () {
    const { data: roles, loading } = useRoles();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
    })

    const getFields = (handleNameSplit: (value: string) => [string, string]) => [
        {
            label: "Name",
            inputProps: {
                id: "name",
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
                type: "email",
                placeholder: "Enter your email",
                required: true,
            },
        },
        {
            label: "Password",
            inputProps: {
                id: "password",
                type: "password",
                placeholder: "Enter your password",
                required: true,
            },
        },
        {
            label: "Role",
            inputProps: {
                id: "role",
                type: "select",
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
            setFormData({ ...formData, firstName, lastName});
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

    if (loading) return <p>Loading</p>
    return (
        <section className={styles.stafftab}>
            <span>
                <input type="text" name="" id="" placeholder="Search staff here..."/>
                <select name="filters" id=""></select>
            </span>
            

            <Button icon={<FaPlus />} text="Add staff" className={styles.addstaffbtn}/>
            <span className={styles.staffsignup}>
                <AuthForm
                    title="Staff Registration"
                    subtitle="Add a new staff"
                    fields={getFields(handleNameSplit)}
                    actions={
                    <>
                        <Button text="Sign Up" type="submit" className={styles.signupbutton}/>
                    </>
                    }
                />
            </span>
            <span> Send staff invite</span>
        </section>
    )
}