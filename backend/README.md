# EN2H Booking Platform REST API

This repository contains the backend REST API implementation for the **EN2H Software Engineer Intern (NestJS) Technical Assignment**. 

The platform allows administrators to authenticate and manage services (e.g., flight booking, train schedules, car rentals), and allows customers/users to search and book travel services.

---

## Technical Stack & Architecture

- **Framework**: [NestJS](https://nestjs.com/) (v11) & TypeScript
- **Database ORM**: [Prisma ORM](https://www.prisma.io/) (v7)
- **Database Engine**: PostgreSQL
- **Security & Encryption**: JWT (JSON Web Tokens), Passport, and Bcrypt
- **API Documentation**: Swagger UI (OpenAPI v3)
- **Validation**: Class-Validator & Class-Transformer

The codebase follows a modular NestJS architecture with domain layers divided into three primary modules:
1. `AuthModule`: Handles administrator/agent registration, login credentials verification, and JWT issuance.
2. `ServicesModule`: Enables authenticated users to create, update, retrieve, and delete travel services.
3. `BookingsModule`: Allows anonymous booking placement, booking listing, details viewing, updates, and cancellations.

---

## Database Schema (Prisma 7)

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string password
        string name
        datetime createdAt
        datetime updatedAt
    }
    SERVICE {
        int id PK
        string title
        string description
        int duration
        float price
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    BOOKING {
        int id PK
        string customerName
        string customerEmail
        string customerPhone
        int serviceId FK
        datetime bookingDate
        string bookingTime
        BookingStatus status
        string notes
        datetime createdAt
        datetime updatedAt
    }
    SERVICE ||--o{ BOOKING : houses
```

---

## Installation & Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL Database** running locally or remotely on port `5432`

### 2. Clone and Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 3. Environment Configuration
Create or modify the `.env` file in the project root:
```env
DATABASE_URL="postgresql://postgres:rachana@localhost:5432/en2h_booking_db?schema=public"
JWT_SECRET="en2h-nestjs-booking-platform-jwt-secret-key-998877"
PORT=5000
```

### 4. Database Setup & Seeding
Prisma 7 is configured to run direct driver adapters (`pg` pool). To run migrations, build schema tables in PostgreSQL, and seed the database with initial sample data:
```bash
# Apply database migrations
npx prisma migrate dev --name init

# Seed database with an administrator account and mock services
npx prisma db seed
```

*Mock Seed Accounts generated:*
- **Admin Login Email**: `admin@entwoh.com`
- **Admin Password**: `Password123!`

---

## Running the Application

### Development mode:
```bash
npm run start:dev
```

### Production Build & Run:
```bash
npm run build
npm run start:prod
```

Once running:
- **Server Endpoint:** [http://localhost:5000/](http://localhost:5000/)
- **Interactive Swagger API Docs:** [http://localhost:5000/api](http://localhost:5000/api) (You can test endpoints, payloads, validation rules, and inject JWT authorization directly in the UI!)

---

## API Endpoints List

### 1. Authentication (`/auth`)
- `POST /auth/register` (Public): Register a new admin/user.
- `POST /auth/login` (Public): Log in and retrieve the JWT bearer token.

### 2. Service Management (`/services`) — *Protected (Requires JWT)*
- `POST /services`: Create a new travel service.
- `GET /services`: Get a list of all travel services.
- `GET /services/:id`: Get detailed data for a service.
- `PUT /services/:id`: Update details for a service.
- `DELETE /services/:id`: Delete a service.

### 3. Booking Management (`/bookings`)
- `POST /bookings` (Public): Place a booking (requires contact details, serviceId, date, time).
- `POST /bookings/:id/cancel` (Public): Cancel a booking.
- `GET /bookings` (Protected): Get list of all bookings (Admin/Agents).
- `GET /bookings/:id` (Protected): Get a single booking's details (Admin/Agents).
- `PATCH /bookings/:id/status` (Protected): Update booking status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).

---

## Core Business Rules Implemented

1. **Service Verification**: A booking must belong to an existing service ID, and that service must be set to `isActive: true`.
2. **Date Guard**: Booking dates cannot be placed in the past (validated using current server time).
3. **Status Integrity Constraint**: Cancelled bookings (`status: CANCELLED`) cannot be modified to `COMPLETED`.
4. **Validation Guard**: Request parameters, time formats (HH:MM), and email fields are fully validated at the controller entrance using NestJS `ValidationPipe`.
5. **Bonus Feature (Duplicate Prevention)**: The API automatically prevents duplicate bookings for the same service, date, and time slot if the existing booking has not been cancelled.

---

## Assumptions Made

- **Public Cancellations**: Customers who book without registering are allowed to cancel their own bookings via `POST /bookings/:id/cancel` since they might not be authenticated users.
- **Admin Management**: Only authenticated administrators/agents are allowed to list all bookings or view booking lists.
- **Time Slots**: Service booking slots are specified as time strings (e.g. `"14:30"` in `HH:MM` format) coupled with a calendar date to allow maximum flexibility.
