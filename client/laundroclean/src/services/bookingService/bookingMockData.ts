import { BookingDetail, BookingReceipt } from "src/types/booking/bookingOrder";
import { mapDeliveryType } from "src/types/booking/bookingStatus";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
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
        firstname: "John",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "02-05-2026",
        scheduledDate: "10-05-2026",
        deliveryType: "PICK_UP",
        status: "CONFIRMED",
        finalAmount: 5000,
        currency: "NAIRA",
        assignedStaff: "Matt",
        assignedToId: "2",
        email: "johndoe@testmail.com",
        phoneNumber: "09036378473634",
        isActive: true,
        createdAt: "01-05-2025",
        updatedAt: "02-05-2025",
        deletedAt: "05-05-2025",
    },
    {
        id: "2",
        customBookingId: "BK002",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "CONFIRMED",
        finalAmount: 5000,
        currency: "NAIRA",
        assignedStaff: "ADMIN USER",
        assignedToId: "1",
    },
    {
        id: "3",
        customBookingId: "BK003",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "4",
        customBookingId: "BK004",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPLETED",
        finalAmount: 5000,
        currency: "NAIRA"
    },
     {
        id: "5",
        customBookingId: "BK005",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "CONFIRMED",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "6",
        customBookingId: "BK006",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "7",
        customBookingId: "BK007",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPLETED",
        finalAmount: 5000,
        currency: "NAIRA"
    },
     {
        id: "8",
        customBookingId: "BK008",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "CONFIRMED",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "9",
        customBookingId: "BK009",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "10",
        customBookingId: "BK0010",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPLETED",
        finalAmount: 5000,
        currency: "NAIRA"
    },
     {
        id: "11",
        customBookingId: "BK0011",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "CONFIRMED",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "12",
        customBookingId: "BK0012",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPANY_DROPPED_OFF_AT_POINT",
        finalAmount: 5000,
        currency: "NAIRA"
    },
    {
        id: "13",
        customBookingId: "BK0013",
        firstname: "Maria",
        lastname: "Doe",
        serviceType: "Laundry Wash",
        datepaid: "04-05-2026",
        scheduledDate: "12-05-2026",
        deliveryType: "DROP_OFF",
        status: "COMPLETED",
        finalAmount: 5000,
        currency: "NAIRA"
    }
]

const mappedCurrency = transformFieldInArray(bookingDetails, "currency", mapCurrencySymbol)

export const mappedDelivery: BookingDetail[] = transformFieldInArray(mappedCurrency, "deliveryType", mapDeliveryType)

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