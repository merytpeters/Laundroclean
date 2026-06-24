import AllServices from "src/components/ui/AllServices/AllServices";
import { mockCompanyAdmin } from "src/services/companyUser/mock";
import styles from "./laundroclean-services.module.css";

export default function LaundroCleanServices () {
    return (
        <div className={styles.servicescontainer}>
            <AllServices
              companyuser={mockCompanyAdmin}
            />
        </div>
    )
}