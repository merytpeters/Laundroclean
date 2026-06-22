import AllServices from "src/components/ui/AllServices/AllServices";
import styles from "./ServicesModal.module.css";
import { mockCompanyStaff } from "src/services/companyUser/mock";

export default function StaffServicesModal () {
    return (
        <div className={styles.servicesmodalcontainer}>
            <AllServices
              companyuser={mockCompanyStaff}
            />
        </div>
    )
}