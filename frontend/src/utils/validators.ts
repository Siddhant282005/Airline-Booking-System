import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const flightSearchSchema = z.object({
  departureAirportId: z.string().min(1, 'Departure airport is required'),
  arrivalAirportId: z.string().min(1, 'Arrival airport is required'),
  departureDate: z.string().optional(),
  passengers: z.number().min(1).max(9).default(1),
});

export const createFlightSchema = z.object({
  flightNumber: z.string().min(1, 'Flight number is required'),
  airplaneId: z.number().min(1, 'Airplane is required'),
  departureAirportId: z.string().min(1, 'Departure airport is required'),
  arrivalAirportId: z.string().min(1, 'Arrival airport is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  boardingGate: z.string().optional(),
  totalSeats: z.number().min(1, 'Total seats must be greater than 0'),
});

export const bookingSchema = z.object({
  flightId: z.number(),
  userId: z.number(),
  noOfSeats: z.number().min(1).max(9),
});

export const citySchema = z.object({
  name: z.string().min(1, 'City name is required'),
});

export const airportSchema = z.object({
  name: z.string().min(1, 'Airport name is required'),
  code: z.string().min(3, 'Airport code must be at least 3 characters'),
  address: z.string().min(1, 'Address is required'),
  cityId: z.number().min(1, 'City is required'),
});

export const airplaneSchema = z.object({
  modelNumber: z.string().min(1, 'Model number is required'),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
});
