# Smart Sky Frontend

<p align="center">
  <strong>Modern customer + admin web interface for the Smart Sky microservices platform.</strong>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Port" src="https://img.shields.io/badge/Port-5173-orange">
</p>

## What This App Does

- Provides customer flows for signup/login, flight browsing, booking, and booking history
- Provides admin flows for managing flights, cities, airports, airplanes, and users
- Integrates with API Gateway and downstream microservices

## Local URL

- Default development URL: `http://localhost:5173`

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router v6
- Zustand
- Axios
- React Hook Form + Zod
- Tailwind CSS
- Framer Motion + Lucide React

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_FLIGHTS_SERVICE_URL=http://localhost:3000/flightsService
VITE_BOOKING_SERVICE_URL=http://localhost:3000/bookingService
VITE_NOTIFICATION_SERVICE_URL=http://localhost:3000/notificationService
```

## Install and Run

```bash
npm install
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
|-- components/
|   |-- common/
|   `-- layout/
|-- pages/
|   `-- admin/
|-- routes/
|-- services/
|-- store/
`-- utils/
```

## Feature Highlights

### Customer
- Authentication (JWT-based)
- Flight search and booking flow
- Seat selection and booking confirmation
- My bookings dashboard

### Admin
- Admin login and protected routes
- CRUD flows for flights, cities, airports, and airplanes
- User management section

## Integrated Backend Services

- API Gateway (`3000`) for auth and service entry
- Flights Service (`3001`) for inventory and flight data
- Booking Service (`3002`) for bookings and payments
- Notification Service (`3003`) for ticket/notification handling

## License

ISC
