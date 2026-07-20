import { BookingDetail, BookingReceipt } from "src/types/booking/bookingOrder";
import { mapDeliveryType } from "src/types/booking/bookingStatus";
import { transformFieldInArray } from "src/utils/mapData";

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
        customBookingId: "BK001",
        customerName: "John Doe",
        serviceType: "Laundry Wash",
        datepaid: "02-05-2026",
        deliveryDate: "10-05-2026",
        deliveryType: "PICK_UP",
        status: "CONFIRMED",
        amount: "5000",
    },
    {
        id: "2",
        customBookingId: "BK002",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "CONFIRMED",
        amount: "5000",
    },
    {
        id: "3",
        customBookingId: "BK003",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        amount: "5000",
    },
    {
        id: "4",
        customBookingId: "BK004",
        customerName: "Maria Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        deliveryDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPLETED",
        amount: "5000",
    }
]

export const mappedDelivery: BookingDetail[] = transformFieldInArray(bookingDetails, "deliveryType", mapDeliveryType)

export const bookingReceiptData: BookingReceipt[] = [
    {
        id: "1",
        customBookingId: "BK001",
        serviceType: "Regular Wash",
        paidAmount: 5000,
        currency: "NAIRA",
        channel: "debit card",
        provider: "paystack",
        transactionRef: "DHSAUHSASGAB202610601",
        paidAt: "01-06-2026",
        itemCount: 10
    },
    {
        id: "2",
        customBookingId: "BK002",
        serviceType: "Regular Wash",
        paidAmount: 5000,
        currency: "NAIRA",
        channel: "debit card",
        provider: "paystack",
        transactionRef: "DHSAUHSASUASHIDS202610606",
        paidAt: "06-06-2026",
        weight: 15
    },
]