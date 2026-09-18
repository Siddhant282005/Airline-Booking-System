import { flightsApi } from './api';
import { ApiResponse, Flight, City, Airport, Airplane, FlightSearchParams, CreateFlightRequest, Seat } from '@/types';

export const flightService = {
  // Flights
  getAllFlights: async (params?: FlightSearchParams): Promise<ApiResponse<Flight[]>> => {
    const response = await flightsApi.get<ApiResponse<Flight[]>>('/api/v1/flights', { params });
    return response.data;
  },

  getFlight: async (id: number): Promise<ApiResponse<Flight>> => {
    const response = await flightsApi.get<ApiResponse<Flight>>(`/api/v1/flights/${id}`);
    return response.data;
  },

  createFlight: async (data: CreateFlightRequest): Promise<ApiResponse<Flight>> => {
    const response = await flightsApi.post<ApiResponse<Flight>>('/api/v1/flights', data);
    return response.data;
  },

  updateFlight: async (id: number, data: Partial<CreateFlightRequest>): Promise<ApiResponse<Flight>> => {
    const response = await flightsApi.patch<ApiResponse<Flight>>(`/api/v1/flights/${id}`, data);
    return response.data;
  },

  updateSeats: async (id: number, seats: number, dec: boolean = true): Promise<ApiResponse<Flight>> => {
    const response = await flightsApi.patch<ApiResponse<Flight>>(`/api/v1/flights/${id}/seats`, { seats, dec });
    return response.data;
  },

  deleteFlight: async (id: number): Promise<ApiResponse<void>> => {
    const response = await flightsApi.delete<ApiResponse<void>>(`/api/v1/flights/${id}`);
    return response.data;
  },

  // Cities
  getAllCities: async (): Promise<ApiResponse<City[]>> => {
    const response = await flightsApi.get<ApiResponse<City[]>>('/api/v1/cities');
    return response.data;
  },

  getCity: async (id: number): Promise<ApiResponse<City>> => {
    const response = await flightsApi.get<ApiResponse<City>>(`/api/v1/cities/${id}`);
    return response.data;
  },

  createCity: async (name: string): Promise<ApiResponse<City>> => {
    const response = await flightsApi.post<ApiResponse<City>>('/api/v1/cities', { name });
    return response.data;
  },

  updateCity: async (id: number, name: string): Promise<ApiResponse<City>> => {
    const response = await flightsApi.patch<ApiResponse<City>>(`/api/v1/cities/${id}`, { name });
    return response.data;
  },

  deleteCity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await flightsApi.delete<ApiResponse<void>>(`/api/v1/cities/${id}`);
    return response.data;
  },

  // Airports
  getAllAirports: async (): Promise<ApiResponse<Airport[]>> => {
    const response = await flightsApi.get<ApiResponse<Airport[]>>('/api/v1/airports');
    return response.data;
  },

  getAirport: async (id: string): Promise<ApiResponse<Airport>> => {
    const response = await flightsApi.get<ApiResponse<Airport>>(`/api/v1/airports/${id}`);
    return response.data;
  },

  createAirport: async (data: Omit<Airport, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Airport>> => {
    const response = await flightsApi.post<ApiResponse<Airport>>('/api/v1/airports', data);
    return response.data;
  },

  updateAirport: async (id: string, data: Partial<Omit<Airport, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Airport>> => {
    const response = await flightsApi.patch<ApiResponse<Airport>>(`/api/v1/airports/${id}`, data);
    return response.data;
  },

  deleteAirport: async (id: string): Promise<ApiResponse<void>> => {
    const response = await flightsApi.delete<ApiResponse<void>>(`/api/v1/airports/${id}`);
    return response.data;
  },

  // Airplanes
  getAllAirplanes: async (): Promise<ApiResponse<Airplane[]>> => {
    const response = await flightsApi.get<ApiResponse<Airplane[]>>('/api/v1/airplanes');
    return response.data;
  },

  getAirplane: async (id: number): Promise<ApiResponse<Airplane>> => {
    const response = await flightsApi.get<ApiResponse<Airplane>>(`/api/v1/airplanes/${id}`);
    return response.data;
  },

  createAirplane: async (data: Omit<Airplane, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Airplane>> => {
    const response = await flightsApi.post<ApiResponse<Airplane>>('/api/v1/airplanes', data);
    return response.data;
  },

  updateAirplane: async (id: number, data: Partial<Omit<Airplane, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Airplane>> => {
    const response = await flightsApi.patch<ApiResponse<Airplane>>(`/api/v1/airplanes/${id}`, data);
    return response.data;
  },

  deleteAirplane: async (id: number): Promise<ApiResponse<void>> => {
    const response = await flightsApi.delete<ApiResponse<void>>(`/api/v1/airplanes/${id}`);
    return response.data;
  },

  // Seats
  getSeatsForFlight: async (flightId: number): Promise<ApiResponse<Seat[]>> => {
    const response = await flightsApi.get<ApiResponse<Seat[]>>(`/api/v1/seats/flight/${flightId}`);
    return response.data;
  },

  getAvailableSeatsForFlight: async (flightId: number): Promise<ApiResponse<Seat[]>> => {
    const response = await flightsApi.get<ApiResponse<Seat[]>>(`/api/v1/seats/flight/${flightId}/available`);
    return response.data;
  },
};
