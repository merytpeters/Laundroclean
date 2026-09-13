import { AllBankAccounts, NewBankAccount } from "src/components/ui/PaymentNBillingUI/bankAccountUI"
import styles from "./systems.module.css"
import { AllPOSDevices, NewPOSDevice } from "src/components/ui/PaymentNBillingUI/posDeviceUI"

export default function Systems() {
    return (
        <section className={styles.systemContainer}>

            <section>
                payment and billings
                <section>
                    Bank Accounts

                    <NewBankAccount />
                    <AllBankAccounts />
                </section>

                <section>
                    POS devices

                    <NewPOSDevice />
                    <AllPOSDevices />
                </section>
            </section>
            <hr />
            <section>

                Google calendar Settings

            </section>

            <hr />

            <section>
                Notification Settings
            </section>

            <hr />

            <section>
                Feature Control
            </section>


        </section>
    )
}