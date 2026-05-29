import { FiPlus } from "react-icons/fi";
import styles from './clientbookings.module.css';

export default function ClientBookings () {
    return (
        <div className={styles.clientbookingcontainer}>
            <button className={styles.addnewbtn}>
                <span>Add new</span>
                    <FiPlus size={30}/>
            </button>
               
            <section aria-label="Booking display Section" className={styles.tablesection}>
                Booking History
            </section>
        </div>
    )
}