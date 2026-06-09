"use client";
import { FaPlus, FaTimes } from 'react-icons/fa';
import styles from './StaffTab.module.css';
import Button from 'src/components/ui/Button/Button';
import AuthForm from 'src/components/ui/Forms/AuthForms';
import { useState } from 'react';
import { useRoles } from 'src/hooks/roles/useRoles';
import { LocalSearchBar, FilterSearch } from '../SearchBar/SearchBar';

export default function StaffTab () {
    const [open, setOpen] = useState(false);
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
            <div className={styles.actionsWrap}>
                <Button icon={open ? <FaTimes /> : <FaPlus />} text={open ? "Cancel" : "Add Staff"} className={open ? styles.cancelbtn : styles.addstaffbtn} onClick={() => setOpen(!open)}/> 
                
                <div className={`${styles.panel} ${open ? styles.open : ''}`}>
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
                </div>
            </div>

            <span className={styles.localsearchfilter}>
                <LocalSearchBar placeholder="Find Staff" />
                <FilterSearch />
            </span>
            
            
        </section>
    )
}