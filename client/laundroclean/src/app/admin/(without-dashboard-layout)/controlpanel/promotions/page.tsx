import Button from "src/components/ui/Button/Button";
import { controlpanelbasepath } from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelSidebar";
import styles from './promotions.module.css';

export default function Promotions () {
    return (
        <div style={{ color: "#000"}}>
            Promotions
            <Button text="Create New Promos" className={styles.newpromobtn} href={`${controlpanelbasepath}/promotions`}/>
        </div>
    )
}