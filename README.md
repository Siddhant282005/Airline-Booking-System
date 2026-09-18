# Smart Sky End-to-End Microservices Airline Management System

<p align="center">
  <strong>Production-style airline platform built with microservices, event-driven workflows, and a modern React frontend.</strong>
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white">
  <img alt="RabbitMQ" src="https://img.shields.io/badge/RabbitMQ-Message%20Queue-FF6600?logo=rabbitmq&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-ISC-blue">
</p>

---

## Overview

Smart Sky is a full-stack airline management and booking platform designed with a microservices architecture.  
It separates authentication, flight inventory, booking/payment orchestration, and notification delivery into independent services behind an API gateway.

This repository includes:

- API Gateway for auth, role-based access, and service proxying
- Flights Service for cities, airports, airplanes, flights, and seat inventory
- Booking Service for booking lifecycle and payment flow
- Notification Service for asynchronous email notifications via RabbitMQ
- React + TypeScript frontend for customers and admins

## System Architecture

```text
Frontend (React + Vite)
        |
        v
API Gateway (Auth + Proxies)
   |              |
   v              v
Flights Service   Booking Service -----> RabbitMQ -----> Notification Service
                        |
                        v
                     MySQL
```

## Microservices and Ports

| Service | Default Port | Responsibility |
|---|---:|---|
| API Gateway | `3000` | Authentication, authorization, user APIs, request proxying |
| Flights Service | `3001` | Flights domain: airplanes, cities, airports, flights, seats |
| Booking Service | `3002` | Booking creation, payment handling, cancellation, user bookings |
| Notification Service | `3003` | Consumes queue messages and sends booking confirmation emails |
| Frontend (Vite) | `5173` | Customer and admin web interface |

## Key Features

- JWT-based authentication with role checks (admin/customer flows)
- Flight search and seat-aware booking process
- Booking payment endpoint with idempotency support headers
- Admin management modules for flights, cities, airports, airplanes, and users
- RabbitMQ-backed asynchronous notification pipeline
- Clean frontend architecture with route protection and state management

## Tech Stack

### Backend
- Node.js, Express, Sequelize, MySQL
- JWT (`jsonwebtoken`), `bcrypt`
- RabbitMQ (`amqplib`)
- Logging with Winston

### Frontend
- React 18 + TypeScript + Vite
- React Router, Zustand
- Tailwind CSS, Framer Motion
- Axios, React Hook Form, Zod

## Repository Structure

```text
.
|-- API-Gateway/
|-- Flights/
|-- Flights-Booking-Service/
|-- Noti-Service/
|-- frontend/
`-- Smart-Sky-Postman-Collection.json
```

## Prerequisites

Install these before running the project:

- Node.js 18+
- npm 9+
- MySQL 8+
- RabbitMQ 3+

## Environment Configuration

Create `.env` files by copying each service's `.env.example`.

### API Gateway (`API-Gateway/.env`)

```env
PORT=3000
SALT_ROUNDS=10
JWT_SECRET=your_cryptographically_random_64_char_secret_here
JWT_EXPIRY=1d
FLIGHT_SERVICE=http://localhost:3001
BOOKING_SERVICE=http://localhost:3002
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_sky
```

### Flights Service (`Flights/.env`)

```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_sky
```

### Booking Service (`Flights-Booking-Service/.env`)

```env
PORT=3002
FLIGHT_SERVICE=http://localhost:3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_sky
```

### Notification Service (`Noti-Service/.env`)

```env
PORT=3003
GMAIL_EMAIL=your_gmail@gmail.com
GMAIL_PASS=your_16_char_app_password_here
```

### Frontend (`frontend/.env`)

```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_FLIGHTS_SERVICE_URL=http://localhost:3000/flightsService
VITE_BOOKING_SERVICE_URL=http://localhost:3000/bookingService
VITE_NOTIFICATION_SERVICE_URL=http://localhost:3000/notificationService
```

## Installation and Run Guide

### 1) Install dependencies

Run once in each service directory:

```bash
cd API-Gateway && npm install
cd ../Flights && npm install
cd ../Flights-Booking-Service && npm install
cd ../Noti-Service && npm install
cd ../frontend && npm install
```

### 2) Database migration (and optional seed data)

From each backend service:

```bash
npx sequelize-cli db:migrate
```

Optional sample data for Flights Service:

```bash
cd Flights
npx sequelize-cli db:seed:all
```

### 3) Start infrastructure

- Ensure MySQL is running
- Ensure RabbitMQ is running on `amqp://localhost:5672`

### 4) Start backend services

Open separate terminals:

```bash
cd API-Gateway && npm run dev
cd Flights && npm run dev
cd Flights-Booking-Service && npm run dev
cd Noti-Service && npm run dev
```

### 5) Start frontend

```bash
cd frontend && npm run dev
```

Frontend URL: `http://localhost:5173`

## API Surface (High-Level)

### API Gateway
- `POST /api/v1/user/signup`
- `POST /api/v1/user/signin`
- `GET /api/v1/user` (admin)
- `POST /api/v1/user/role` (admin)

### Flights Service
- `/api/v1/airplanes`
- `/api/v1/cities`
- `/api/v1/airports`
- `/api/v1/flights`
- `/api/v1/seats`

### Booking Service
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/user/:userId`
- `POST /api/v1/bookings/payment` and `POST /api/v1/bookings/payments`
- `PATCH /api/v1/bookings/:id/cancel`

### Notification Service
- `POST /api/v1/tickets`

## Testing APIs

Use the included Postman collection:

- `Smart-Sky-Postman-Collection.json`

## Security and Operational Notes

- Replace all placeholder secrets before deployment.
- Use a strong `JWT_SECRET` and non-root DB credentials in production.
- Configure CORS to trusted frontend origins in production.
- Run services behind HTTPS and a reverse proxy in real deployments.

## Future Improvements

- Add Docker Compose for one-command local startup
- Add unit/integration tests and CI pipelines
- Add observability (metrics, tracing, centralized logging)
- Add refresh tokens and secure session rotation

## Authors

**Susparsh Jakhmola**
**Suryansh Chandrakar**
**Siddhant Payal**

---
