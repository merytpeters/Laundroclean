import PaymentModal from "src/components/ui/Modals/CompanyUser/PaymentModal/PaymentModal"
import { mockClient } from "src/services/clientuser/mock"

export default function ClientPayment () {
    return (
        <div style={{color: "black", flexShrink: 1, width: "100%", }}>
            <PaymentModal usertype={mockClient}/>
        </div>
    )
}