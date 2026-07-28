"use client";

import { useState } from "react";
import styles from "./PaymentModal.module.css";
import DebitCardUI from "src/components/ui/PaymentUI/DebitCardUI";
import { CompanyUser, Client } from "src/types/users/user";

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
    img: "",
    component: "",
  },
  {
    key: "transfer",
    label: "Bank Transfer",
    img: "/img/bankbuildingicon.png",
    component: "",
  },
  {
    key: "wallet",
    label: "OPay Wallet",
    img: "/img/opayicon.png",
    component: "",
  },
  {
    key: "pos",
    label: "POS Machine",
    img: "/img/posicon.png",
    component: "",
  },
];

type PaymentProps = {
  usertype: CompanyUser | Client;
};

export default function PaymentModal({ usertype }: PaymentProps) {
  const isCompany = usertype?.type === "COMPANYUSER";
  console.log(usertype);

  const tabs = paymentTabs.filter((tab) => {
  if (isCompany) {
    return ["pos", "cash", "transfer", "wallet"].includes(tab.key);
  }

  return tab.key !== "pos";
});

  const [activeTab, setActiveTab] = useState<PaymentTab["key"]>(tabs[0].key);

  return (
    <div className={styles.paymentmodalcontainer}>
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
            className={`${styles.tabbtn} ${
              activeTab === tab.key ? styles.active : ""
            }`}
          >
            <span className={styles.iconnlabel}>
              <img src={tab.img} width={20} height={20} alt="" />
              {tab.label}
            </span>

            <hr
              className={`${styles.simpleline} ${
                activeTab === tab.key ? styles.simplelineactive : ""
              }`}
            />
          </button>
        ))}
      </section>

      <section className={styles.activetabcontainer}>
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </section>
    </div>
  );
}