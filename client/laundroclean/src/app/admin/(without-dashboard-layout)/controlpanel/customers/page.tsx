"use client";

import UserInfoUI from "src/components/ui/UserInfoUI/UserInfoUI"

export default function Customers () {
    return (
        <div style={{ color: "#000", width: "100%", padding: "1em", display: "flex", flexDirection: "column", alignItems: "center"}}>
            Customers Insights
            <UserInfoUI />
        </div>
    )
}