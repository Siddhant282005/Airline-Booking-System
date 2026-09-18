import { bookingApi } from './api';
import { ApiResponse, Booking, CreateBookingRequest, MakePaymentRequest } from '@/types';

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
    const response = await bookingApi.post<ApiResponse<Booking>>('/api/v1/bookings', data);
    return response.data;
  },

  makePayment: async (data: MakePaymentRequest, idempotencyKey: string): Promise<ApiResponse<Booking>> => {
    const response = await bookingApi.post<ApiResponse<Booking>>('/api/v1/bookings/payments', data, {
      headers: {
        'x-idempotency-key': idempotencyKey,
      },
    });
    return response.data;
  },

  getBooking: async (id: number): Promise<ApiResponse<Booking>> => {
    const response = await bookingApi.get<ApiResponse<Booking>>(`/api/v1/bookings/${id}`);
    return response.data;
  },

  getUserBookings: async (userId: number): Promise<ApiResponse<Booking[]>> => {
    const response = await bookingApi.get<ApiResponse<Booking[]>>(`/api/v1/bookings/user/${userId}`);
    return response.data;
  },
};
