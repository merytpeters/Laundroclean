import { BookingStatus } from '@prisma/client';

export const BookingTransitions: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.CANCELLED, BookingStatus.CONFIRMED],

  [BookingStatus.CONFIRMED]: [
    BookingStatus.COMPANY_PICKED_UP_FROM_CUSTOMER,
    BookingStatus.CUSTOMER_DROPPED_OFF_AT_POINT,
  ],

  [BookingStatus.COMPANY_PICKED_UP_FROM_CUSTOMER]: [BookingStatus.IN_PROGRESS],

  [BookingStatus.CUSTOMER_DROPPED_OFF_AT_POINT]: [BookingStatus.COMPANY_PICKED_UP_FROM_POINT],

  [BookingStatus.COMPANY_PICKED_UP_FROM_POINT]: [BookingStatus.IN_PROGRESS],

  [BookingStatus.IN_PROGRESS]: [
    BookingStatus.WASHED,
    BookingStatus.COMPANY_DROPPED_OFF_AT_POINT,
    BookingStatus.IN_TRANSIT,
  ],

  [BookingStatus.WASHED]: [
    BookingStatus.IN_TRANSIT,
    BookingStatus.COMPANY_DROPPED_OFF_AT_POINT
  ],

  [BookingStatus.IN_TRANSIT]: [BookingStatus.COMPANY_DROPPED_OFF_AT_POINT, BookingStatus.DELIVERED],

  [BookingStatus.COMPANY_DROPPED_OFF_AT_POINT]: [BookingStatus.CUSTOMER_PICKED_UP_FROM_POINT],

  [BookingStatus.CUSTOMER_PICKED_UP_FROM_POINT]: [BookingStatus.DELIVERED, BookingStatus.COMPLETED],

  [BookingStatus.DELIVERED]: [BookingStatus.COMPLETED],
  
  [BookingStatus.COMPLETED]: [],

  [BookingStatus.CANCELLED]: [],
};
