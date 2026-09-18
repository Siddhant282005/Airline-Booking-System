export interface City {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Airport {
  id: string;
  name: string;
  code: string;
  address: string;
  cityId: number;
  city?: City;
  createdAt: string;
  updatedAt: string;
}

export interface Airplane {
  id: number;
  modelNumber: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airplaneId: number;
  departureAirportId: string;
  arrivalAirportId: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  boardingGate: string;
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
  airplaneDetail?: Airplane;
  departureAirport?: Airport;
  arrivalAirport?: Airport;
}

export interface FlightSearchParams {
  trips?: string;
  price?: string;
  travellers?: string;
  departureAirportId?: string;
  arrivalAirportId?: string;
}

export interface CreateFlightRequest {
  flightNumber: string;
  airplaneId: number;
  departureAirportId: string;
  arrivalAirportId: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  boardingGate: string;
  totalSeats: number;
}
