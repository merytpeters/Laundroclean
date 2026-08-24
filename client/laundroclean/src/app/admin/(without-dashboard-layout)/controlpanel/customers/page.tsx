"use client";

import UserInfoUI from "src/components/ui/UserInfoUI/UserInfoUI"

export default function Customers() {
    return (
        <div style={{ color: "#000", width: "100%", padding: "1em", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "3em", marginLeft: "4em"}}>
            <UserInfoUI usertype="CLIENT" />
        </div>
    )
}