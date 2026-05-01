import React from "react";
import ControlPanelLayoutComponent from "src/components/ui/Modals/CompanyUser/Admin/ControlPanel/ControlPanelLayout";

export default async function ControlPanelLayout ({children} : {children: React.ReactNode}) {
    return (
        <div>
            <ControlPanelLayoutComponent />
            {children}
        </div>
    )
}