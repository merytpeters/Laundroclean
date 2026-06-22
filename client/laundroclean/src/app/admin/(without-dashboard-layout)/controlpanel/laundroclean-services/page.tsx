import AllServices from "src/components/ui/AllServices/AllServices";
import { mockCompanyAdmin } from "src/services/companyUser/mock";

export default function LaundroCleanServices () {
    return (
        <div style={{ color: "#000"}}>
            <AllServices
              companyuser={mockCompanyAdmin}
            />
        </div>
    )
}