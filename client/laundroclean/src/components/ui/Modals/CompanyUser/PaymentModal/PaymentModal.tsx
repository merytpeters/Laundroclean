"use client";

import { useState } from "react";
import styles from "./PaymentModal.module.css";
import DebitCardUI from "src/components/ui/PaymentUI/DebitCardUI";
import { CompanyUser, Client } from "src/types/users/user";
import PaymentHistory from "src/components/ui/PaymentUI/PaymentHistory";
import CashUI from "src/components/ui/PaymentUI/CashUI";
import BankTransferUI from "src/components/ui/PaymentUI/BankTransferUI";

type PaymentTab = {
    key: "card" | "transfer" | "pos" | "wallet" | "cash";
    label: string;
    img: string;
    component: React.ReactNode;
};

const paymentTabs: PaymentTab[] = [
    {
        key: "card",
        label: "Credit / Debit Card",
        img: "/img/creditcardicon.png",
        component: <DebitCardUI />,
    },
    {
        key: "cash",
        label: "Cash",
        img: "/img/cash-on-delivery.png",
        component: <CashUI />,
    },
    {
        key: "transfer",
        label: "Bank Transfer",
        img: "/img/bankbuildingicon.png",
        component: <BankTransferUI />,
    },
    {
        key: "wallet",
        label: "OPay Wallet",
        img: "/img/payment.png",
        component: "",
    },
    {
        key: "pos",
        label: "POS Machine",
        img: "/img/pos-terminal.png",
        component: "",
    },
];

type PaymentProps = {
    user: CompanyUser | Client;
};

export default function PaymentModal({ user }: PaymentProps) {
    const isCompany = user?.type === "COMPANYUSER";
    // console.log(user);

    const tabs = paymentTabs.filter((tab) => {
        return isCompany
            ? ["pos", "cash", "transfer", "wallet"].includes(tab.key)
            : ["card", "transfer", "wallet"].includes(tab.key);
    });

    const [activeTab, setActiveTab] = useState<PaymentTab["key"]>(tabs[0].key);

    return (
        <section className={styles.paymentmodalcontainer}>
            <section className={styles.paymentmethodcontainer}>
                <strong className={styles.headertext}>Payment Methods</strong>

                <section className={styles.headertab}>
                    <select
                        className={styles.tabSelect}
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as PaymentTab["key"])}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.key} value={tab.key}>
                                {tab.label}
                            </option>
                        ))}
                    </select>

                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`${styles.tabbtn} ${activeTab === tab.key ? styles.active : ""
                                }`}
                        >
                            <span className={styles.iconnlabel}>
                                <img src={tab.img} width={25} height={25} alt="" />
                                {tab.label}
                            </span>

                            <hr
                                className={`${styles.simpleline} ${activeTab === tab.key ? styles.simplelineactive : ""
                                    }`}
                            />
                        </button>
                    ))}
                </section>

                <section className={styles.activetabcontainer}>
                    {tabs.find((tab) => tab.key === activeTab)?.component}
                </section>
            </section>
            <section className={styles.paymenthistorysection}>
                <PaymentHistory />
            </section>
        </section>
    );
}