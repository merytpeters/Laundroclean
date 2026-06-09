import { BookingDetail } from "src/types/bookingOrder";
import { DeliveryType, mapDeliveryType } from "src/types/bookingStatus";

export const stats = {};
export const bookingScheduleData = [
    {
        id: "1",
        time: "09:00 AM",
        customerName: "John Doe",
        serviceType: "Laundry Wash",
        status: "COMPLETED",
        deliveryType: "DROP_OFF"
    },
    {
        id: "2",
        time: "09:00 AM",
        customerName: "Michael Doe",
        serviceType: "Laundry Wash",
        status: "CUSTOMER_PICKED_UP_FROM_POINT",
        deliveryType: "PICK_UP"
    },
    {
        id: "3",
        time: "10:00 AM",
        customerName: "John Doe",
        serviceType: "Laundry Wash",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        deliveryType: "DROP_OFF"
    },
    {
        id: "4",
        time: "09:00 AM",
        customerName: "John Doe",
        serviceType: "Laundry Wash",
        status: "DELIVERED",
        deliveryType: "PICK_UP"
    },
    {
        id: "5",
        time: "09:00 AM",
        customerName: "linda Doe",
        serviceType: "Laundry Wash",
        status: "CONFIRMED",
        deliveryType: "PICK_UP"
    },
]


export const bookingDetails: BookingDetail[] = [
    {
        id: "1",
        bookingId: "BK001",
        customerName: "John Doe",
        serviceType: "Laundry Wash",
        datepaid: "02-05-2026",
        deliveryDate: "10-05-2026",
        rawDeliveryType: "PICK_UP",
        status: "CONFIRMED",
        amount: "5000",
    },
    {
        id: "2",
        bookingId: "BK002",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        rawDeliveryType: "DROP_OFF",
        status: "CONFIRMED",
        amount: "5000",
    },
    {
        id: "3",
        bookingId: "BK003",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        rawDeliveryType: "DROP_OFF",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        amount: "5000",
    },
    {
        id: "4",
        bookingId: "BK004",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        rawDeliveryType: "DROP_OFF",
        status: "COMPLETED",
        amount: "5000",
    }
]

export const mappedDelivery: BookingDetail[] = bookingDetails.map((item) => {
    let delivery: DeliveryType | undefined;
    try {
        delivery = item.rawDeliveryType ? mapDeliveryType(item.rawDeliveryType) : undefined;
    } catch {
        delivery = undefined;
    }

    return ({ ...item, deliveryType: delivery } as BookingDetail);
})