export type BookingDetail = {
    id: string;
    customBookingId: string;
    customerName: string;
    serviceType: string;
    datepaid: string;
    deliveryDate: string;
    deliveryType: string;
    status: string;
    amount: string;
    assignedStaff?: string;
    progressCount?: number;
    itemCount?: number;
    weight?: number;
    additionalNote?: string;
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