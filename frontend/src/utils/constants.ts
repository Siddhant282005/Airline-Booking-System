export const API_ENDPOINTS = {
  API_GATEWAY: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
  FLIGHTS_SERVICE: import.meta.env.VITE_FLIGHTS_SERVICE_URL || 'http://localhost:3000/flightsService',
  BOOKING_SERVICE: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:3000/bookingService',
  NOTIFICATION_SERVICE: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3000/notificationService',
};

export const ROUTES = {
  WELCOME: '/',
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FLIGHTS: '/flights',
  FLIGHT_DETAILS: '/flights/:id',
  BOOKING: '/booking',
  BOOKING_CONFIRMATION: '/booking-confirmation',
  MY_BOOKINGS: '/my-bookings',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_FLIGHTS: '/admin/flights',
  ADMIN_CITIES: '/admin/cities',
  ADMIN_AIRPORTS: '/admin/airports',
  ADMIN_AIRPLANES: '/admin/airplanes',
  ADMIN_USERS: '/admin/users',
};

export const STORAGE_KEYS = {
  TOKEN: 'smart_sky_token',
  USER: 'smart_sky_user',
};

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};
