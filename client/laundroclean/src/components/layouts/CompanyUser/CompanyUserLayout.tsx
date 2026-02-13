"use client";

import { CompanyUser } from "../../../types/user";
import { roleConfig } from "src/lib/company-user/role-config";
import AppHeader from "src/components/ui/AppHeader/AppHeader";
import ActionButton from "src/components/ui/ActionButton/ActionButton";
import { BellIcon, Cog6ToothIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import AppHeaderMenu from "src/components/ui/AppHeaderMenu/AppHeaderMenu";
import { CompanyUserMenuProvider, useCompanyUserMenu } from "./context/CompanyUserMenuContext";
import WelcomeMessage from "src/components/ui/WelcomeMessage/WelcomeMessage";
import styles from './CompanyUserLayout.module.css'

interface CompanyUserLayoutProps {
  user: CompanyUser;
  children: React.ReactNode;
  welcomeMessage?: { title: string; message: string };
  showMenu?: boolean;
}

const LayoutContent = ({ user, children, welcomeMessage, showMenu = true }: CompanyUserLayoutProps) => {
  const { activeMenu, setActiveMenu, menuItems, setMenuItems } = useCompanyUserMenu();
  const config = roleConfig[user.role];

  const isControlPanel = config.settingsAction === "CONTROL PANEL";


  if (menuItems.length === 0 && config.menuItems) {
    setMenuItems(config.menuItems);
  }

  return (
      <div className={styles.layoutContainer}>
        <AppHeader
          userButton={
            config && (
              <ActionButton
                text={config.dashboardText}
                href={config.dashboardHref}
                className={styles.dashboardButton}
              />
            )
          }

          notificationButton={
            config?.showNotifications ? (
              <ActionButton
                icon={<BellIcon className={styles.iconStyle} />}
                text="Notifications"
                className={styles.iconButton}
              // onClick={() => console.log("Open notifications")}
              />
            ) : null
          }

          settingsOrControlPanelButton={
            config && (
              <ActionButton
                icon={
                  isControlPanel ? (
                    <WrenchScrewdriverIcon className={styles.iconStyle} />
                  ) :
                    (
                      <Cog6ToothIcon className={styles.iconStyle} />
                    )
                }
                text={isControlPanel ? "Control Panel" : "Settings"}
                  href={config.settingsHref}
                  className={styles.iconButton}
              />
            )
          }
        />

       {welcomeMessage && (
        <div className={styles.welcomeWrapper}>
          <WelcomeMessage
            title={welcomeMessage.title}
            message={welcomeMessage.message}
          />
        </div>
        )}

        {showMenu && config.menuItems && config.menuItems.length > 0 && (
        <div className={styles.navWrapper}>
          <AppHeaderMenu
            items={config.menuItems}
            activeKey={activeMenu || ""}
            onItemClick={setActiveMenu}
          />
        </div>
        )}
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
  );
}

export default function CompanyUserLayout(props: CompanyUserLayoutProps) {
  return (
    <CompanyUserMenuProvider
      initialMenuItems={props.user.role ? roleConfig[props.user.role].menuItems : []}
    >
      <LayoutContent {...props} />
    </CompanyUserMenuProvider>
  );
}
