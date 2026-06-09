import { DeliveryType } from "./bookingStatus"

export type BookingDetail = {
    id: string;
    bookingId: string;
    customerName: string;
    serviceType: string;
    datepaid: string;
    deliveryDate: string;
    rawDeliveryType?: string;
    deliveryType?: DeliveryType;
    status: string;
    amount: string;
    assignedStaff?: string;
    progressCount?: number;
}