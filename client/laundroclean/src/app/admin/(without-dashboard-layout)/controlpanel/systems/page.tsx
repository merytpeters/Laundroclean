"use client";

import { AllBankAccounts, NewBankAccount } from "src/components/ui/PaymentNBillingUI/bankAccountUI"
import styles from "./systems.module.css"
import { AllPOSDevices, NewPOSDevice } from "src/components/ui/PaymentNBillingUI/posDeviceUI"
import { useBankAccounts } from "src/hooks/paymentChannels/useBankAccount";
import { useAuth } from "src/context/AuthContext";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "src/hooks/debounceHook";
import Pagination from "src/components/ui/Pagination/Pagination";
import { usePOSDevices } from "src/hooks/paymentChannels/usePOSDevice";

export default function Systems() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const debouncedSearch = useDebounce(search, 500);
    // const isDefault = true; // will update to allow user to set
    const bankAccountQueryParams = {
        // isDefault,
        page,
        limit,
        debouncedSearch
    }
    const posDeviceQueryParams = {
        page,
        limit,
        debouncedSearch
    }
    const { authUser } = useAuth()


    

    const { data: bankresponseData, isLoading } = useBankAccounts({
        params: {
            ...bankAccountQueryParams
        }
    });

    const { data: posDeviceResponseData, isLoading: posDeviceLoading } = usePOSDevices({
        params: {
            ...posDeviceQueryParams
        }
    })

    if (!authUser || authUser.type !== "COMPANYUSER" || authUser.uiRole !== "ADMIN") {
        return null;
    }
    const userUIRole = authUser.uiRole
    
    if (isLoading || posDeviceLoading) {
        return <LoadingState />
    }

    const bankData = Array.isArray(bankresponseData)
        ? bankresponseData
        : Array.isArray(bankresponseData?.data)
            ? bankresponseData.data
            : [];

    const bankresponseMetaData = bankresponseData?.meta

    const posData = Array.isArray(posDeviceResponseData)
        ? posDeviceResponseData
        : Array.isArray(posDeviceResponseData?.data)
            ? posDeviceResponseData.data
            : [];

    const posDeviceResponseMetaData = posDeviceResponseData?.meta

    return (
        <section className={styles.systemContainer}>
            <section className={styles.paymentnbillingContainer}>

                <section className={styles.bankaccounts}>
                    <h4>Payment & Billings</h4>
                    <p><strong>Bank Accounts</strong></p>
                    <NewBankAccount />
                    <AllBankAccounts data={bankData} userUIRole={userUIRole} />
                    <Pagination
                        totalPages={
                            bankresponseMetaData?.totalPages ?? 1
                        }
                    />
                </section>

                <section>
                    <span><strong>POS Devices</strong></span>

                    <NewPOSDevice />
                    <AllPOSDevices data={posData} userUIRole={userUIRole} />
                    <Pagination
                        totalPages={
                            posDeviceResponseMetaData?.totalPages ?? 1
                        }
                    />
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