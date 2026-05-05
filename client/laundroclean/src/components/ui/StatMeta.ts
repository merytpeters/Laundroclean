import { FaMoneyBillWave, FaClipboardList, FaUsers, FaStar, FaShirtsinbulk } from "react-icons/fa";

export const statMeta = {
  dailyRevenue: {
    icon: FaMoneyBillWave,
    unit: "₦",
    text: ""
  },
  activeBookings: {
    icon: FaClipboardList,
    unit: "",
    text: ""
  },
  activeClient: {
    icon: FaUsers,
    unit: "",
    text: ""
  },
  customerSatisfaction: {
    icon: FaStar,
    unit: "",
    text: ""
  }
};

export const AdminCPStatMeta = {
  totalRevenue: {
    icon: FaMoneyBillWave,
    unit: "₦",
    text: ""
  },

  totalStaff: {
    icon: FaUsers,
    unit: "",
    text: ""
  },

  totalUsers: {
    icon: FaUsers,
    unit: "",
    text: ""
  },

  totalFulfilledBookings: {
    icon: FaShirtsinbulk,
    unit: "",
    text: "",
  }
}
