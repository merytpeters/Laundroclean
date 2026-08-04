"use client";
import Button from "src/components/ui/Button/Button";
import styles from './RolesTab.module.css';


export default function RolesTab() {
    return (
        <section className={styles.roletabContainer}>

            <span className={styles.actionbtn}>
                <Button text="Create new role" className={styles.newrolebtn} />
            </span>


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