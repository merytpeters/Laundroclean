type DeliveryType = "drop off" | "pick up"

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
   | "completed"
   | "in-progress"
   | "awaiting drop off"
   | "cancelled"
   | "in-transit"
   | "at pickup-point"
   | "customer picked up"
   | "picked from doorstep"
   | "delivered to doorstep"
   | "collected from pickup location"
   | "rider dropped off"
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
    "at pickup-point": "at_pickup_point",
    "collected from pickup location": "in_transit",
    "picked from doorstep": "in_transit",
    "customer picked up": "delivered"
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
            return "at pickup-point";
        case "COMPANY_PICKED_UP_FROM_POINT":
            return "collected from pickup location";
        case "COMPANY_PICKED_UP_FROM_CUSTOMER":
            return "picked from doorstep";
        case "IN_TRANSIT":
            return "in-transit";
        case "IN_PROGRESS":
            return "in-progress";
        case "COMPLETED":
            return "completed";
        case "CUSTOMER_PICKED_UP_FROM_POINT":
            return "customer picked up";
        case "COMPANY_DROPPED_OFF_AT_POINT":
            return "rider dropped off";
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
