import styles from "./AllServices.module.css";
import { CompanyUser, Client } from "src/types/user";

interface AllServicesProps {
    companyuser?: CompanyUser;
    clientuser?: Client;
}

function DropOffLocation() {
    return (
        <div>
            Drop off location edit
        </div>
    )
}

function ServiceAreaLocation() {
    return (
        <div>
            ServiceArea Location edits
        </div>
    )
}

function ServicePrice() {
    return (
        <div>
            ServicePrice Edit
        </div>
    )
}

function ServicesList() {
    return (
        <div>
            Services List
        </div>
    )
}

export default function AllServices(props: AllServicesProps ) {
    return (
        <div className={styles.allservicescontainer}>AllServices
            {props.companyuser && <section>
                CompanyUserView Only

                <ServicePrice />
                <ServiceAreaLocation />
                <DropOffLocation />

            </section>}

            <section>
                <ServicesList />
            </section>
        </div>
    )
}