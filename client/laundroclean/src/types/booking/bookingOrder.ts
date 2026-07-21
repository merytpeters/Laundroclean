export type BookingDetail = {
    id: string;
    customBookingId: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    serviceType: string;
    datepaid: string;
    scheduledDate?: string;
    deliveryType: string;
    status: string;
    assignedStaff?: string;
    assignedToId?: string;
    progressCount?: number;
    itemCount?: number;
    weight?: number;
    additionalNote?: string;
    currency: "NAIRA" | "DOLLAR" | "POUNDS";
    unitPrice?: number;
    totalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    pickupTime?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export type BookingReceipt = {
    id: string;
    customBookingId: string;
    serviceType: string;
    paidAmount: number;
    currency: string;
    channel: string;
    provider?: string;
    transactionRef: string;
    paidAt: string;
    itemCount?: number;
    weight?: number;
}