export enum SeatType {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  FIRST_CLASS = 'FIRST_CLASS',
}

export interface Seat {
  id: number;
  airplaneId: number;
  row: number;
  col: string;
  type: SeatType;
  isBooked: boolean;
  flightId: number | null;
  createdAt: string;
  updatedAt: string;
}
