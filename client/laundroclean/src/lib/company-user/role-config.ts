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
  statCards?: StatConfig[];
  clientInfoCardTitle: string,
  clientInfoCardMessage: string,
  AdminCPStatCards?: StatConfig[];
  BookingStatCards?: StatConfig[];
  DeliveryStatCards?: StatConfig[];
}

export interface InfoHeaderConfig {
  title: string;
  subheading: string;
}

export interface StatConfig {
  title: string;
  key: string;
}

export const roleConfig: Record<Role, RoleConfig> = {
  [Role.ADMIN]: {
    dashboardText: "Admin Dashboard",
    dashboardHref: "/admin/dashboard",
    showNotifications: true,
    settingsHref: "/admin/controlpanel/reports-analysis",
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
    statCards: [
      {title: "Today's Revenue", key: "dailyRevenue"},
      {title: "Active Bookings", key: "activeBookings"},
      {title: "Total Active Client", key: "activeClient"},
      {title: "Customer Satisfaction", key: "customerSatisfaction"}
    ],
    clientInfoCardTitle : "Customers",
    clientInfoCardMessage: "All Customers",
    AdminCPStatCards: [
      {title: "Total Revenue", key: "totalRevenue"},
      {title: "Total Staff", key: "totalStaff"},
      {title: "Total Users", key: "totalUsers"},
      {title: "Total Fulfilled Bookings", key: "totalFulfilledBookings"},
    ],
    BookingStatCards: [
      {title: "Today's Bookings", key: "dailyBookings"},
      {title: "in Progress", key: "inprogressBookings"},
      {title: "Pending Bookings", key: "pendingBookings"},
      {title: "Today's Fulfilled Orders", key: "dailyFulfilledOrders"}
    ],
    DeliveryStatCards: [
      {title: "Today's Pending Deliveries", key: "pendingDeliveries"},
      {title: "Today's Pending Pickups", key: "pendingPickups"},
    ]
  },
  [Role.STAFF]: {
    dashboardText: "Staff Dashboard",
    dashboardHref: "/staff/dashboard",
    showNotifications: true,
    settingsHref: "/settings",
    settingsAction: "SETTINGS",
    menuItems: [
      {label: "Overview", key: "overview"},
      {label: "Bookings", key: "bookings"},
      {label: "Delivery", key: "delivery"},
      {label: "Payment", key: "payment"},
      {label: "Chat", key: "chat"},
      {label: "Calendar", key: "calendar"}
    ],
    statCards: [
      {title: "Active Bookings", key: "activeBookings"},
      {title: "Customer Satisfaction", key: "customerSatisfaction"}
    ],
    clientInfoCardTitle : "Customers Assigned",
    clientInfoCardMessage: "Assigned Customers",
    BookingStatCards: [
      {title: "Today's Bookings", key: "dailyBookings"},
      {title: "in Progress", key: "inprogressBookings"},
      {title: "Pending Bookings", key: "pendingBookings"},
    ],
    DeliveryStatCards: [
      {title: "Assigned Deliveries", key: "pendingDeliveries"},
      {title: "Assigned Pickups", key: "pendingPickups"},
    ]
  },
};
