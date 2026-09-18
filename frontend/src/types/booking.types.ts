export enum BookingStatus {
  INITIATED = 'INITIATED',
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export interface Booking {
  id: number;
  flightId: number;
  userId: number;
  status: BookingStatus;
  noOfSeats: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  flightId: number;
  userId: number;
  noOfSeats: number;
  seatIds?: number[];
}

export interface MakePaymentRequest {
  bookingId: number;
  userId: number;
  totalCost: number;
  userEmail: string;
}
