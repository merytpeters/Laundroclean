import { Role } from "src/types/role";


export type SettingsActionType = "SETTINGS" | "CONTROL PANEL";

export interface RoleConfig {
  dashboardText: string;
  dashboardHref: string;
  showNotifications?: boolean;
  settingsHref: string;
  settingsAction: SettingsActionType;
}

export const roleConfig: Record<Role, RoleConfig> = {
  [Role.ADMIN]: {
    dashboardText: "Admin Dashboard",
    dashboardHref: "/admin",
    showNotifications: true,
    settingsHref: "/admin/control-panel",
    settingsAction: "CONTROL PANEL",
  },
  [Role.STAFF]: {
    dashboardText: "Staff Dashboard",
    dashboardHref: "/staff",
    showNotifications: true,
    settingsHref: "/settings",
    settingsAction: "SETTINGS",
  },
  [Role.CASHIER]: {
    dashboardText: "Cashier Dashboard",
    dashboardHref: "/cashier",
    showNotifications: true,
    settingsHref: "/settings",
    settingsAction: "SETTINGS",
  },
};
