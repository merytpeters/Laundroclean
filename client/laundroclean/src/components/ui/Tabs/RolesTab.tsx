"use client";
import Button from "src/components/ui/Button/Button";
import { FaPlus } from "react-icons/fa";
import { controlpanelbasepath } from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import styles from './RolesTab.module.css';


// update hrefs later to open up form components
export default function RolesTab () {
    return (
        <>
            <span>View Staff - edit, deactivate toggle, change role
                <Button text="Create new role" className={styles.newrolebtn} href={`${controlpanelbasepath}/staff-access`}/>
                <Button icon={<FaPlus />} text="Add staff" className={styles.addstaffbtn} href={`${controlpanelbasepath}/staff-access`}/>
            </span>
        </>
    )
}