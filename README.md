# RouteReserve: Travel Booking & Management Platform

<div align="center">

  ![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
  ![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)
  ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss)
  ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

  <p align="center">
    A premium, unified travel reservation agency portal supporting flights, trains, buses, and car rentals with dynamic pricing calculations, multi-passenger ticket booking, and real-time history tracking.
  </p>
</div>

> [!IMPORTANT]
> **🚀 Deployed Live Website:** You can access the fully functional online application directly at **[https://routereserve-travel-booking.vercel.app](https://routereserve-travel-booking.vercel.app)**.
> 
> *Experience instant, production-optimized page transitions and real-time transits booking flows!*

---

## 📖 Project Overview

**RouteReserve** is a next-generation unified travel agent dashboard designed to streamline routing reservations. Built as a high-performance monorepo, it connects a modern glassmorphic Next.js frontend with a secure NestJS backend REST API using Prisma ORM and PostgreSQL. 

The application is tailored for the Indian market, displaying values in Indian Rupees (INR) with USD conversions, and pre-seeded with famous hubs across all Indian states and popular international transits.

---

## 🌟 Features

### ✈️ Dynamic Flights & Surge Pricing
*   **Trip Types:** Toggle between **One-Way** and **Round-Trip 🔄** routes. Activating Round-Trip shows return flight selectors and doubles ticket costs automatically.
*   **Proximity Surge Logic:** Calculates pricing dynamically based on the search date:
    *   *International flights* surge to **1 Lakh+** (e.g. ₹1,10,000 / $1,320) if departure is within 30 days.
    *   *Domestic flights* surge to **10k - 30k** if close, otherwise falling back to standard budget levels.
*   **Varied Listings:** Scans **10+ flight options** from real airlines (Air India, Vistara, IndiGo, Akasa Air, SpiceJet, Emirates, Singapore Airlines, Swiss, etc.).

### 🚆 Indian Railways Trains Module
*   **Train Options:** Scans **10+ train listings** including Vande Bharat Express, Shatabdi Express, Rajdhani Express, Duronto Express, Humsafar Express, Tejas Express, Garib Rath, and local Mail/Express transits.
*   **Pricing:** Ranges from budget sleeper classes (₹350) up to premium Vande Bharat AC Executive chair cars (₹3,00,000+).

### 🚌 Luxury & Budget Buses Module
*   **Indian Operators:** Scans **20+ bus connection options** from major private/public operators:
    *   *Premium sleepers:* Suguma Tourist, Durgamba Motors, KSRTC Ambaari Utsav, VRL Travels, SRS Travels, Orange Tours.
    *   *Luxury Sleepers:* Zingbus Premium AC (Heavy Costly, ₹1,500–₹3,500).
    *   *Budget Sleepers/Seaters:* Bharati Travels (cheapest rates starting from ₹750), Sea Bird Tourist.
*   **Distance-Based Scaling:** Automatically doubles/triples ticket baseline costs for longer inter-state routes (e.g. Pune/Solapur/Kolkata).

### 👥 Multiple Passenger Reservations
*   **Dynamic Traveler Input:** Supports booking **1 to 9 passengers** at a time.
*   **Traveler Details:** Dynamically renders input fields to collect the **Name** and **Age** of every individual traveler.
*   **Invoice Multiplication:** Multiplies ticket costs automatically across booking screens, database entries, and confirmations.

### 📊 Interactive Dashboard Analytics
*   Renders dynamic transactional and reservation charts using **Chart.js** detailing agency statistics.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Packages |
|---|---|---|
| **Frontend** | React 19, Next.js 15+ (App Router), TypeScript | Tailwind CSS v4, Lucide Icons, Chart.js, Framer Motion, Axios |
| **Backend** | NestJS 11, TypeScript | @nestjs/swagger, Passport-JWT, Bcrypt, Class-Validator |
| **Database** | PostgreSQL | Prisma ORM 7 |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend) | Neon Serverless / Supabase (Cloud Database) |

---

## 📂 Project Structure

```text
RouteReserve-Travel-Booking-System/
  ├── images/                # Visual screenshots for GitHub presentation
  ├── frontend/              # Next.js User Interface
  │    ├── src/app/          # Page routes (App Router)
  │    ├── src/services/     # API Integration layers
  │    └── package.json      # Frontend package configuration
  ├── backend/               # NestJS API Server
  │    ├── src/              # Modules, controllers, and services
  │    ├── prisma/           # Database schemas, migrations, and seeds
  │    └── package.json      # Backend package configuration
  ├── .env.example           # Root environment variable template
  ├── .gitignore             # Global build and credential exclusions
  └── package.json           # Monorepo task automation script
```

---

## ⚙️ Environment Variables (`.env.example`)

Create a local `.env` file in the **`backend/`** directory matching this configuration:

```env
# PostgreSQL Connection String (used by Prisma)
DATABASE_URL="postgresql://db_user:db_password@localhost:5432/routereserve_db?schema=public"

# JWT Token Verification Secret Key
JWT_SECRET="your-jwt-alphanumeric-secret-key-goes-here"

# API Port
PORT=5000
```

*Note: The real `.env` file is excluded globally via `.gitignore` to prevent database credentials from leaking on GitHub.*

---

## 🚀 Installation & Local Setup

### 1. Database Migrations & Seeding
Ensure **PostgreSQL** is running on your machine (default port: `5432`). Apply migrations to compile schema tables, then seed the startup databases:

```bash
# Navigate to the backend folder
cd backend

# Run Prisma Migrations
npx prisma migrate dev --name init

# Seed database with travel services and admin user
npx prisma db seed
```

### 2. Run Servers
From the **root folder**, automate dependencies installation and startup:

```bash
# 1. Install all packages in frontend & backend
npm run install:all

# 2. Run Backend API Server (runs on http://localhost:5000)
npm run dev:backend

# 3. Run Frontend Next.js Server (runs on http://localhost:3000)
npm run dev:frontend
```

---

## 📖 Swagger API Documentation
NestJS automatically hosts interactive OpenAPI documentation.
*   **Swagger URL:** **[http://localhost:5000/api](http://localhost:5000/api)**
*   Provides full sandboxed execution panels to test JWT registers, logins, service query routes, and checkout history.

---

## 📸 Screenshots Showcase

All showcase screenshots should be placed in the root `/images/` directory. To display your screenshots correctly on GitHub, select your best captures from your screenshots collection and rename them to match the filenames in the table below:

| Target Filename | What Image to Use | Markdown Link |
|---|---|---|
| **Original Capture** | Homepage search dashboard (glassmorphism tabs selector) | `![Landing](./images/Screenshot%202026-07-13%20031321.png)` |
| **Original Capture** | Flight search results (INR + USD brackets) | `![Flights](./images/Screenshot%202026-07-13%20121236.png)` |
| **Original Capture** | Multiple passenger forms with name/age inputs | `![Booking Forms](./images/Screenshot%202026-07-13%20121245.png)` |
| **Original Capture** | Booking Confirmed invoice receipt page | `![Receipt](./images/Screenshot%202026-07-13%20121253.png)` |
| **Original Capture** | Clear slate bookings history panel | `![History](./images/Screenshot%202026-07-13%20121301.png)` |
| **Original Capture** | NestJS Swagger API interactive developer docs header | `![Swagger API Header](./images/Screenshot%202026-07-13%20002654.png)` |
| **Original Capture** | Swagger Authentication & Service Module Endpoints | `![Swagger Endpoints](./images/Screenshot%202026-07-13%20002735.png)` |
| **Original Capture** | Swagger API POST request execution (e.g. Services / Register) | `![Swagger POST](./images/Screenshot%202026-07-13%20224000.png)` |
| **Original Capture** | Swagger Database Schema Definition - User & Auth Models | `![Swagger Schema User](./images/Screenshot%202026-07-13%20223653.png)` |
| **Original Capture** | Swagger Database Schema Definition - Service & Booking Models | `![Swagger Schema Booking](./images/Screenshot%202026-07-13%20223641.png)` |
| **`11_train_search_empty.png`** | Empty train search status panel | `![Trains Empty](./images/11_train_search_empty.png)` |
| **`12_train_search_results.png`** | Train search results (Vande Bharat Express, Shatabdi) | `![Trains Search](./images/12_train_search_results.png)` |
| **`13_train_booking_modal.png`** | Train booking passenger details input forms | `![Train Booking Modal](./images/13_train_booking_modal.png)` |
| **`14_train_checkout_receipt.png`** | Confirmed train ticket invoice receipt page | `![Train Receipt](./images/14_train_checkout_receipt.png)` |
| **`15_bus_search_empty.png`** | Empty bus search status panel | `![Buses Empty](./images/15_bus_search_empty.png)` |
| **`16_bus_search_results.png`** | Bus search results (Suguma Tourist, Zingbus Premium, Bharati) | `![Buses Search](./images/16_bus_search_results.png)` |
| **`17_bus_booking_modal.png`** | Bus booking passenger configuration forms | `![Bus Booking Modal](./images/17_bus_booking_modal.png)` |
| **`18_bus_checkout_receipt.png`** | Confirmed bus booking ticket invoice receipt page | `![Bus Receipt](./images/18_bus_checkout_receipt.png)` |
| **`19_car_rental_list.png`** | Car rental catalog (Thar 4x4, Nexon EV) | `![Car List](./images/19_car_rental_list.png)` |
| **`20_car_booking_modal.png`** | Car rental driver config details & dates checkout form | `![Car Booking Modal](./images/20_car_booking_modal.png)` |
| **`21_car_checkout_receipt.png`** | Confirmed car rental booking receipt | `![Car Receipt](./images/21_car_checkout_receipt.png)` |
| **`22_prisma_db_seeding.png`** | Terminal log of running `npx prisma db seed` | `![DB Seeding](./images/22_prisma_db_seeding.png)` |

---

### Visual Previews

### 1. RouteReserve Landing Homepage & Booking Flow
![01 Landing Page](./images/Screenshot%202026-07-13%20031321.png)
![02 Flights Search](./images/Screenshot%202026-07-13%20121236.png)
![03 Booking Modal](./images/Screenshot%202026-07-13%20121245.png)
![04 Invoice Receipt](./images/Screenshot%202026-07-13%20121253.png)
![05 Booking History](./images/Screenshot%202026-07-13%20121301.png)

### 2. NestJS Swagger Developer Documentation Header
![06 Swagger API Header](./images/Screenshot%202026-07-13%20002654.png)

### 3. Swagger Authentication & Service Endpoints (Endpoints, POST Executions, & Schemas)
![07 Swagger Endpoints](./images/Screenshot%202026-07-13%20002735.png)
![08 Swagger POST](./images/Screenshot%202026-07-13%20224000.png)
![09 Swagger Schema User](./images/Screenshot%202026-07-13%20223653.png)
![10 Swagger Schema Booking](./images/Screenshot%202026-07-13%20223641.png)

### 4. Empty Train Search State
![11 Trains Empty](./images/11_train_search_empty.png)

### 5. Indian Railway Connections Search
![12 Trains Search](./images/12_train_search_results.png)

### 6. Train Passenger Registration Form
![13 Train Booking Modal](./images/13_train_booking_modal.png)

### 7. Train Invoice Receipt Confirmation
![14 Train Receipt](./images/14_train_checkout_receipt.png)

### 8. Empty Bus Search State
![15 Buses Empty](./images/15_bus_search_empty.png)

### 9. Indian Bus Operators Search
![16 Buses Search](./images/16_bus_search_results.png)

### 10. Bus Passenger Registration Form
![17 Bus Booking Modal](./images/17_bus_booking_modal.png)

### 11. Bus Invoice Receipt Confirmation
![18 Bus Receipt](./images/18_bus_checkout_receipt.png)

### 12. Car Rental Vehicle Catalog
![19 Car List](./images/19_car_rental_list.png)

### 13. Car Rental Checkout Form
![20 Car Booking Modal](./images/20_car_booking_modal.png)

### 14. Car Rental Invoice Receipt Confirmation
![21 Car Receipt](./images/21_car_checkout_receipt.png)

### 15. Terminal PostgreSQL Seeding Output
![22 DB Seeding](./images/22_prisma_db_seeding.png)

*To update these previews on your fork, simply replace the files inside the `/images/` root directory.*

---

## 🔮 Future Enhancements
- [ ] Add real payment gateway integration (Razorpay / Stripe).
- [ ] Integrate SMS reservation alerts using Twilio.
- [ ] Implement seat selection charts (visual seats map).
- [ ] Implement multi-city flight routes.