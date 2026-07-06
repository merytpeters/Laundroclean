"use client";
import { toast } from 'sonner';
import { FaPlus, FaTimes } from 'react-icons/fa';
import styles from './StaffTab.module.css';
import Button from 'src/components/ui/Button/Button';
import AuthForm from 'src/components/ui/Forms/AuthForms';
import { useState } from 'react';
import { useRoles } from 'src/hooks/roles/useRoles';
import { LocalSearchBar, FilterSearch } from '../SearchBar/SearchBar';
import { useRegisterUser } from 'src/hooks/auth/useAuth';

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

    const registerMutation = useRegisterUser();

    const onSubmit: NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]> = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
    
        const data = new FormData(e.currentTarget);
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const typedName = String(data.get("name") ?? "").trim();
    
        const name = [formData.firstName, formData.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || typedName;

        const validatePassword = (pwd: string): string | null => {
            if (!pwd || pwd.length < 7) return 'Password must be a minimum of 7 letters';
            if (!/^[A-Z]/.test(pwd)) return 'First letter must be uppercase';
            if (!/[!@#$%^&*]/.test(pwd)) return 'Must contain at least one special character';
            return null;
        }
        
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
        }, {
            onSuccess(data) {
            toast.success(data?.message);
            form.reset();
            setFormData({ firstName: '', lastName: '' });
         },
        });
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
                            onSubmit={onSubmit}
                            actions={
                            <>
                                <Button text={registerMutation.isPending ? "Signing Up..." : "Sign Up"} type="submit" className={styles.signupbutton}/>
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