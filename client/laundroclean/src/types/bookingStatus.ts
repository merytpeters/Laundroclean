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

type BookingStatus = 
   | "pending"
   | "awaiting delivery"
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

// css class map for color coding
export const statusClassMap: Record<string, string> = {
    "pending": "pending",
    "in-progress": "in_progress",
    "awaiting drop off": "awaiting_drop_off",
    "delivered to doorstep": "delivered",
    "delivered": "delivered",
    "in-transit": "in_transit",
    "needs rider": "needs_rider",
    "at dropoff-point": "at_dropoff_point",
    "collected from dropoff location": "in_transit",
    "picked from doorstep": "in_transit",
    "customer picked up": "delivered",
    "cancelled": "cancelled",
    "awaiting delivery": "delivered",
    "returned to dropoff location": "delivered"
}

export function mapBookingStatus(status: string, meta?: {deliveryType?: DeliveryType}) : BookingStatus {
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
        case "CUSTOMER_DROPPED_OFF_AT_POINT":
            return "at dropoff-point";
        case "COMPANY_PICKED_UP_FROM_POINT":
            return "collected from dropoff location";
        case "COMPANY_PICKED_UP_FROM_CUSTOMER":
            return "picked from doorstep";
        case "IN_TRANSIT":
            return "in-transit";
        case "IN_PROGRESS":
            return "in-progress";
        case "COMPLETED":
            return "awaiting delivery";
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
        default:
            throw new Error(`Unknown status: ${status}`)
    }
}

export const BookingStatusDropDownOptions = [
    { value:  "PENDING", label: "pending"},
    { value:  "CONFIRMED", label: "confirmed"},
    { value:  "IN_PROGRESS", label: "in-progress"},
    { value:  "COMPLETED", label: "completed"},
    { value:  "CANCELLED", label: "cancelled"},
    { value:  "IN_TRANSIT", label: "in-transit"},         
    { value:  "DELIVERED", label: "delivered"},
    { value:  "CUSTOMER_DROPPED_OFF_AT_POINT", label: "customer dropped off"},
    { value:  "CUSTOMER_PICKED_UP_FROM_POINT", label: "customer picked up"},
    { value:  "COMPANY_PICKED_UP_FROM_CUSTOMER", label: "delivered to doorstep"},
    { value:  "COMPANY_PICKED_UP_FROM_POINT", label: "collected from dropoff location"},
    { value:  "COMPANY_DROPPED_OFF_AT_POINT", label: "returned to dropoff location"},
]
