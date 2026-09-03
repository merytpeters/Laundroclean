import { 
  FaMoneyBillWave,
  FaClipboardList,
  FaUsers,
  FaStar,
  FaShirtsinbulk,
  FaCalendar,
  FaClock,
  FaTshirt,
  FaTruck
} from "react-icons/fa";

export const statMeta = {
  dailyRevenue: {
    icon: FaMoneyBillWave,
    unit: "₦",
    text: "",
    iconColor: "#2a7c33"
  },
  activeBookings: {
    icon: FaClipboardList,
    unit: "",
    text: "",
    iconColor: "#0f233a"
  },
  activeClient: {
    icon: FaUsers,
    unit: "",
    text: "",
    iconColor: "#0f233a"
  },
  customerSatisfaction: {
    icon: FaStar,
    unit: "",
    text: "",
    iconColor: "#ffd700"
  }
};

export const AdminCPStatMeta = {
  totalRevenue: {
    icon: FaMoneyBillWave,
    unit: "₦",
    text: "",
    iconColor: "#2a7c33"
  },

  totalStaff: {
    icon: FaUsers,
    unit: "",
    text: "",
    iconColor: "#0f233a"
  },

  totalUsers: {
    icon: FaUsers,
    unit: "",
    text: "",
    iconColor: "#0f233a"
  },

  totalFulfilledBookings: {
    icon: FaShirtsinbulk,
    unit: "",
    text: "",
    iconColor: ""
  }
}

export const BookingStatMeta = {
  dailyBookings: {
    icon: FaCalendar,
    unit: "",
    text: "",
    iconColor: "#469BD3"
  },
  inprogressBookings: {
    icon: FaClock,
    unit: "",
    text: "",
    iconColor: "#d59056"
  },
  confirmedBookings: {
    icon: FaTshirt,
    unit: "",
    text: "",
    iconColor: "#FFFF00"
  },
  pendingBookings: {
    icon: FaTshirt,
    unit: "",
    text: "",
    iconColor: "#f00"
  },
  dailyFulfilledOrders: {
    icon: FaShirtsinbulk,
    unit: "",
    text: "",
    iconColor: "#00FF00"
  }
}


export const DeliveryStatMeta = {
  pendingDeliveries: {
    icon: FaTruck,
    unit: "",
    text: "",
    iconColor: "#0f233a"
  },
  pendingPickups: {
    icon: FaTruck,
    unit: "",
    text: "",
    iconColor: "#0f233a"
  }
}
