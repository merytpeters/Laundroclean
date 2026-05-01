import React from "react";
import ControlPanelLayoutComponent from "src/components/layouts/CompanyUser/Admin/ControlPanelLayoutUI";

export default async function ControlPanelLayout ({children} : {children: React.ReactNode}) {
    return (
        <div>
            <ControlPanelLayoutComponent />
            {children}
        </div>
    )
}