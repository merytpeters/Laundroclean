import { Role } from "src/types/role";
import { MenuItem } from "src/components/ui/AppHeaderMenu/AppHeaderMenu";


export type SettingsActionType = "SETTINGS" | "CONTROL PANEL";

export interface RoleConfig {
  dashboardText: string;
  dashboardHref: string;
  showNotifications?: boolean;
  settingsHref: string;
  settingsAction: SettingsActionType;
  menuItems: MenuItem[];
}

export const roleConfig: Record<Role, RoleConfig> = {
  [Role.ADMIN]: {
    dashboardText: "Admin Dashboard",
    dashboardHref: "/admin",
    showNotifications: true,
    settingsHref: "/admin/control-panel",
    settingsAction: "CONTROL PANEL",
    menuItems: [
      {label: "Overview", key: "overview"},
      {label: "Bookings", key: "bookings"},
      {label: "Delivery", key: "delivery"},
      {label: "Payment", key: "payment"},
      {label: "Chat", key: "chat"},
      {label: "Ratings", key: "ratings"},
      {label: "Analytics", key: "analytics"}
    ],
  },
  [Role.STAFF]: {
    dashboardText: "Staff Dashboard",
    dashboardHref: "/staff",
    showNotifications: true,
    settingsHref: "/settings",
    settingsAction: "SETTINGS",
    menuItems: [
      {label: "Overview", key: "overview"},
      {label: "Bookings", key: "bookings"},
      {label: "Delivery", key: "delivery"},
      {label: "Payment", key: "payment"},
      {label: "Chat", key: "chat"},
    ],
  },
  [Role.CASHIER]: {
    dashboardText: "Cashier Dashboard",
    dashboardHref: "/cashier",
    showNotifications: true,
    settingsHref: "/settings",
    settingsAction: "SETTINGS",
    menuItems: [
      {label: "Overview", key: "overview"},
      {label: "Bookings", key: "bookings"},
      {label: "Delivery", key: "delivery"},
      {label: "Payment", key: "payment"},
      {label: "Chat", key: "chat"},
    ],
  },
};
