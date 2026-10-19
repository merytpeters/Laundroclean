export type DeliveryType = "drop off" | "pick up"

export function mapDeliveryType(deliveryType: string) : DeliveryType {
    switch(deliveryType) {
        case "DROP_OFF":
            return "drop off"
        case "PICK_UP":
            return "pick up"
        default:
            throw new Error(`Unknown delivery type: ${deliveryType}`)
    }
}

export type BookingStatus = 
   | "pending"
   | "in-progress"
   | "awaiting drop off"
   | "cancelled"
   | "in-transit"
   | "at dropoff-point"
   | "customer picked up"
   | "picked from doorstep"
   | "delivered to doorstep"
   | "collected from dropoff location"
   | "returned to dropoff location"
   | "delivered"
   | "needs rider"
   | "payment made"
   | "awaiting rider"
   | "washing"
   | "out for delivery"
   | "available for pick up"
   | "completed"
   | "picked up from you"
   | "picked up from drop off point"
   | "washed"

// css class map for color coding
export const statusClassMap: Record<string, string> = {
    "pending": "pending",
    "in-progress": "in_progress",
    "washing": "in_progress",
    "awaiting drop off": "awaiting_drop_off",
    "delivered to doorstep": "delivered",
    "delivered": "delivered",
    "in-transit": "in_transit",
    "picked up from drop off point": "in_transit",
    "picked up from you": "in_transit",
    "needs rider": "needs_rider",
    "awaiting rider": "needs_rider",
    "at dropoff-point": "at_dropoff_point",
    "collected from dropoff location": "in_transit",
    "picked from doorstep": "in_transit",
    "customer picked up": "delivered",
    "cancelled": "cancelled",
    "completed": "delivered",
    "returned to dropoff location": "delivered",
    "available for pick up": "delivered",
    "washed": "needs rider",
    "out for delivery": "in_transit",
}

export function mapBookingStatus(status: string, meta?: {deliveryType?: string}) : BookingStatus {
    switch(status) {
        case "PENDING":
            return "pending";
        case "CANCELLED":
            return "cancelled";
        case "CONFIRMED":
            if (meta?.deliveryType === "pick up") {
                return "needs rider"
            }
            return "awaiting drop off";
        case "WASHED":
            return "needs rider"
        case "CUSTOMER_DROPPED_OFF_AT_POINT":
            return "at dropoff-point";
        case "COMPANY_PICKED_UP_FROM_POINT":
            return "collected from dropoff location";
        case "COMPANY_PICKED_UP_FROM_CUSTOMER":
            return "picked from doorstep";
        case "IN_PROGRESS":
            return "in-progress";
        case "IN_TRANSIT":
            return "in-transit";
        case "CUSTOMER_PICKED_UP_FROM_POINT":
            return "customer picked up";
        case "COMPANY_DROPPED_OFF_AT_POINT":
            return "returned to dropoff location";
        case "DELIVERED":
            if (meta?.deliveryType === "pick up") {
                return "delivered to doorstep";
            }
            if (meta?.deliveryType === "drop off") {
                return "delivered";
            }
        case "COMPLETED":
            return "completed";
        default:
            throw new Error(`Unknown status: ${status}`)
    }
}

export function mapClientBookingStatus(status: string, meta?: {deliveryType?: string}) : BookingStatus {
    switch(status) {
        case "PENDING":
            return "pending";
        case "CANCELLED":
            return "cancelled";
        case "CONFIRMED":
            if (meta?.deliveryType === "pick up") {
                return "awaiting rider"
            }
            return "awaiting drop off";
        case "CUSTOMER_DROPPED_OFF_AT_POINT":
            return "at dropoff-point";
        case "COMPANY_PICKED_UP_FROM_POINT":
            return "picked up from drop off point";
        case "COMPANY_PICKED_UP_FROM_CUSTOMER":
            return "picked up from you";
        case "IN_PROGRESS":
            return "washing";
        case "WASHED":
            return "awaiting rider"
        case "IN_TRANSIT":
            return "out for delivery";
        case "CUSTOMER_PICKED_UP_FROM_POINT":
            return "delivered";
        case "COMPANY_DROPPED_OFF_AT_POINT":
            return "available for pick up";
        case "DELIVERED":
            if (meta?.deliveryType === "pick up") {
                return "delivered to doorstep";
            }
            if (meta?.deliveryType === "drop off") {
                return "delivered";
            }
        case "COMPLETED":
            return "completed";
        default:
            throw new Error(`Unknown status: ${status}`)
    }
}

export const ACTIVE_STATUS = [
    "CONFIRMED",
    "CUSTOMER_DROPPED_OFF_AT_POINT",
    "COMPANY_PICKED_UP_FROM_POINT",
    "COMPANY_PICKED_UP_FROM_CUSTOMER",
    "IN_PROGRESS",
    "IN_TRANSIT",
    "CUSTOMER_PICKED_UP_FROM_POINT",
    "COMPANY_DROPPED_OFF_AT_POINT",
    "WASHED",
    "DELIVERED"
]

export function BookingTrackerProgressCount(status: string) {
    switch(status) {
        case "CONFIRMED":
            return 1;
        case "CUSTOMER_DROPPED_OFF_AT_POINT":
            return 2;
        case "COMPANY_PICKED_UP_FROM_POINT":
            return 3;
        case "COMPANY_PICKED_UP_FROM_CUSTOMER":
            return 3;
        case "IN_PROGRESS":
            return 4;
        case "WASHED":
            return 5
        case "IN_TRANSIT":
            return 6;
        case "COMPANY_DROPPED_OFF_AT_POINT":
            return 7;
        case "CUSTOMER_PICKED_UP_FROM_POINT":
            return 8
        case "DELIVERED":
            return 8
        default:
            return 0
    }
}

export const ClientBookingOrderSteps = [
    "Picked",
    "Washing",
    "Out for delivery",
    "Available at location",
    "Delivered"
]

export const OrderStatusMessage = [
    "Your order is picked",
    "Your order is being washed",
    "Your order is out for delivery",
    "Your Order has arrived at pick up location",
    "Your order has been delivered"
]

export const BookingStatusDropDownOptions = [
    {value: "", label: "select new status"},
    { value:  "PENDING", label: "pending"},
    { value:  "CANCELLED", label: "cancelled"},
    { value:  "CONFIRMED", label: "confirmed"},
    { value:  "CUSTOMER_DROPPED_OFF_AT_POINT", label: "customer dropped off"},
    { value:  "COMPANY_PICKED_UP_FROM_POINT", label: "collected from dropoff location"},
    { value:  "COMPANY_PICKED_UP_FROM_CUSTOMER", label: "picked from doorstep"},
    { value:  "IN_PROGRESS", label: "in-progress"},
    {value: "WASHED", label: "washed"},
    { value:  "IN_TRANSIT", label: "in-transit"},
    { value:  "COMPANY_DROPPED_OFF_AT_POINT", label: "returned to dropoff location"},
    { value:  "CUSTOMER_PICKED_UP_FROM_POINT", label: "customer picked up"},
    { value:  "DELIVERED", label: "delivered to doorstep"},
    { value:  "COMPLETED", label: "completed"},
]

export const ClientBookingStatusDropDownOptions = [
    {value: "", label: "select new status"},
    { value:  "CUSTOMER_DROPPED_OFF_AT_POINT", label: "drop off"},
    { value:  "CUSTOMER_PICKED_UP_FROM_POINT", label: "picked up"},
    { value:  "CANCELLED", label: "cancelled"},
]