import AllServices from "src/components/ui/AllServices/AllServices";
import styles from "./laundroclean-services.module.css"

export default function ClientServicesView () {
    return (
        <div className={styles.servicescontainer}>
            Client Services view
            <AllServices />
        </div>
    )
}