"use client";

import { CompanyUser } from "../../../types/user";
import { roleConfig } from "src/lib/company-user/role-config";
import AppHeader from "src/components/ui/AppHeader/AppHeader";
import ActionButton from "src/components/ui/ActionButton/ActionButton";
import { BellIcon, Cog6ToothIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

interface CompanyUserLayoutProps {
  user: CompanyUser;
  children: React.ReactNode;
}

export default function CompanyUserLayout({ user, children }: CompanyUserLayoutProps) {
  const config = roleConfig[user.role];

  const isControlPanel = config.settingsAction === "CONTROL PANEL";

  return (
    <section>
      <AppHeader
        userButton={
          config && (
            <ActionButton
              text={config.dashboardText}
              href={config.dashboardHref}
              className=""
            />
          )
        }

        notificationButton={
          config?.showNotifications ? (
            <ActionButton
              icon={<BellIcon style={{ width: 24, height: 24, color: "black" }} />}
              text="Notifications"
              className=""
              // onClick={() => console.log("Open notifications")}
            />
          ) : null
        }

        settingsOrControlPanelButton={
          config && (
            <ActionButton
              icon={
                isControlPanel ? (
                  <WrenchScrewdriverIcon style={{ width: 24, height: 24, color: "black" }} />
                ) :
                (
                  <Cog6ToothIcon style={{ width: 24, height: 24, color: "black" }} />
                )
              }
              text={isControlPanel ? "Control Panel" : "Settings"}
              href={config.settingsHref}
              className=""
            />
          )
        }
      />

      {children}
    </section>
  );
}
