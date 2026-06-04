# Order Creation & Dispatch Web App

GitHub Repository: https://github.com/HamzaDsu/order_creation_dispatch_web_app.git

A mini full-stack logistics web application for creating delivery orders, viewing them in a dashboard, assigning available drivers, and updating order delivery status.

This project was built as part of a Full Stack Developer assignment. The goal was to demonstrate a clean and functional end-to-end flow for a logistics platform connecting shippers, dispatchers, and drivers.

---

## Features

### Order Creation

Users can create a new delivery order with the following details:

* Pickup address

  * Street
  * City
  * Postal code
* Delivery address

  * Street
  * City
  * Postal code
* Package description
* Scheduled pickup date and time
* Priority

  * Standard
  * Express
  * Same-day

The form includes basic validation for required fields and valid scheduled pickup time.

---

### Orders Dashboard

The dashboard displays all created orders in a table view with:

* Order ID
* Pickup address
* Delivery address
* Status
* Priority
* Assigned driver
* Created date/time
* Available action

Orders can be filtered by status:

* All
* Pending
* Dispatched
* Delivered

Each status is displayed with a color-coded badge.

---

### Dispatch Action

Pending orders show an **Assign Driver** button.

When clicked, a modal opens and displays a list of mock drivers with:

* Driver name
* Current location
* Availability status

Only available drivers can be selected. Once a driver is selected, the order status changes from **Pending** to **Dispatched**, and the assigned driver's name appears in the order list.

---

### Delivery Status Update

Dispatched orders show a **Mark Delivered** button.

When clicked, the order status changes from **Dispatched** to **Delivered**.

---

## Tech Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express
* TypeScript

### Data Persistence

* Local JSON-based persistence using LowDB
* Mock driver data stored locally

No authentication is included because the assignment requested a simple implementation.

---

## Project Structure

```txt
order_creation_dispatch_web_app/
│
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── db.json
│   │   ├── routes/
│   │   │   ├── drivers.routes.ts
│   │   │   └── orders.routes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   ├── db.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── ordersApi.ts
│   │   ├── components/
│   │   │   ├── DispatchModal.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   ├── OrderList.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

---

## Run Locally

Clone the repository:

```bash
git clone https://github.com/HamzaDsu/order_creation_dispatch_web_app.git
cd order_creation_dispatch_web_app
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```txt
http://localhost:4000
```

You can test the API by opening:

```txt
http://localhost:4000
```

Expected response:

```txt
Order Dispatch API is running
```

You can also test the mock drivers API:

```txt
http://localhost:4000/api/drivers
```

---

## Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## Important

To run the full application, keep both servers running at the same time.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

---

## API Endpoints

### Orders

#### Get all orders

```http
GET /api/orders
```

#### Get orders by status

```http
GET /api/orders?status=Pending
GET /api/orders?status=Dispatched
GET /api/orders?status=Delivered
```

#### Create a new order

```http
POST /api/orders
```

Example request body:

```json
{
  "pickupAddress": {
    "street": "Alexanderplatz 1",
    "city": "Berlin",
    "postalCode": "10178"
  },
  "deliveryAddress": {
    "street": "Main Street 10",
    "city": "Dresden",
    "postalCode": "01067"
  },
  "packageDescription": "Small package with fragile items",
  "scheduledPickupTime": "2026-06-05T10:30",
  "priority": "Express"
}
```

#### Assign driver to order

```http
PATCH /api/orders/:id/dispatch
```

Example request body:

```json
{
  "driverId": "driver-1"
}
```

#### Mark order as delivered

```http
PATCH /api/orders/:id/deliver
```

---

### Drivers

#### Get all drivers

```http
GET /api/drivers
```

---

## Mock Drivers

The application includes mock drivers stored in the backend JSON file.

Example:

```json
[
  {
    "id": "driver-1",
    "name": "Ali Khan",
    "currentLocation": "Berlin",
    "availabilityStatus": "Available"
  },
  {
    "id": "driver-2",
    "name": "Sara Ahmed",
    "currentLocation": "Dresden",
    "availabilityStatus": "Available"
  },
  {
    "id": "driver-3",
    "name": "John Smith",
    "currentLocation": "Leipzig",
    "availabilityStatus": "Busy"
  }
]
```

---

## Architecture Decisions

The project uses a simple full-stack structure with separate `frontend` and `backend` folders.

The backend is built using Express and TypeScript. It exposes REST API endpoints for orders and drivers. The route files contain the API logic directly to keep the project simple and easy to review within the assignment scope.

The frontend is built using React, Vite, TypeScript, and Tailwind CSS. The UI is split into reusable components:

* `OrderForm` handles order creation.
* `OrderList` displays all orders and available actions.
* `DispatchModal` handles assigning drivers.
* `StatusBadge` displays color-coded order statuses.

Data is persisted using a local JSON file. This was chosen because the assignment allows simple persistence options and does not require authentication or a production database.

---

## Trade-offs

This project focuses on correctness, clarity, and completing the required business flow.

Some trade-offs made:

* Used JSON-based persistence instead of a full database.
* Used mock drivers instead of a real driver management system.
* Kept backend routing simple instead of adding a complex layered architecture.
* No authentication was added because it was not required.
* No automated tests were added due to the limited assignment time.

---

## What I Would Improve With More Time

If given more time, I would improve the project by adding:

* PostgreSQL or SQLite database
* Controller-service-repository backend structure
* Authentication and user roles
* Driver availability updates after assignment
* Pagination and search for orders
* Unit and integration tests
* Better form validation using a validation library
* Deployment using Vercel and Railway/Render
* Real-time order updates using WebSockets
* Docker setup for easier local development

---

## Demo Flow

The application supports the following full flow:

1. Create a new delivery order.
2. View the order in the dashboard with **Pending** status.
3. Filter orders by status.
4. Click **Assign Driver**.
5. Select an available driver from the modal.
6. Confirm the order status changes to **Dispatched**.
7. Confirm the assigned driver name appears in the order list.
8. Click **Mark Delivered**.
9. Confirm the order status changes to **Delivered**.

---

## Build Commands

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

---

## Author

Created by Muhammad Hamza.
