# TransitOps

A modern Fleet and Transportation Management System built for the Odoo Hackathon. TransitOps centralizes transportation operations by providing a single platform to manage vehicles, drivers, routes, trips, bookings, maintenance, expenses, and analytics.

The application follows a scalable full-stack architecture with a clean separation between frontend and backend, making it suitable for enterprise transportation management.

Note: All the credentials are currently auto-filled for the demo. We will remove that once the evaluation is finished.

---

## Project Demo

Video Demonstration

https://youtu.be/By-MtoYcXaM

---

## Features

### Authentication

- Secure Login & Registration
- JWT Authentication
- Role-Based Access Control (RBAC)
- Password Encryption using bcrypt
- Protected Routes
- Session Management

### Dashboard

- Operational Overview
- Fleet Statistics
- Active Trips
- Driver Availability
- Vehicle Availability
- Recent Activities
- Performance Metrics

### Fleet Management

- Vehicle Registration
- Vehicle Status Tracking
- Vehicle Availability
- Fleet Monitoring

### Driver Management

- Driver Registration
- Driver Assignment
- License Management
- Driver Availability

### Route Management

- Route Creation
- Route Assignment
- Distance Tracking
- Stop Management

### Trip Management

- Create Trips
- Schedule Trips
- Assign Drivers
- Assign Vehicles
- Trip History
- Trip Status Management

### Booking Management

- Create Bookings
- Booking Validation
- Booking Status
- Booking History

### Maintenance Management

- Maintenance Scheduling
- Service Records
- Maintenance Requests
- Vehicle Service History

### Expense Management

- Fuel Expenses
- Operational Expenses
- Maintenance Costs
- Expense Tracking

### Reports & Analytics

- Fleet Reports
- Driver Reports
- Trip Analytics
- Booking Reports
- Operational Insights

---

## Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- shadcn/ui

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

---

## Project Structure

```text
TransitOps/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── migrations/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── sockets/
    │   ├── uploads/
    │   ├── utils/
    │   ├── validators/
    │   ├── app.js
    │   └── server.js
    ├── package.json
    └── .env
```

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd TransitOps
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Application Workflow

```text
Authentication
      │
      ▼
Dashboard
      │
      ▼
Fleet Management
      │
      ▼
Driver Management
      │
      ▼
Route Management
      │
      ▼
Trip Management
      │
      ▼
Booking Management
      │
      ▼
Maintenance
      │
      ▼
Reports & Analytics
```

---

## Future Enhancements

- Live Vehicle Tracking
- Google Maps Integration
- GPS Support
- AI-based Route Optimization
- Predictive Maintenance
- QR Code Ticketing
- Push Notifications
- Email Notifications
- WebSocket-based Live Updates
- Mobile Application

---

## Team

### Team Leader

Prince Kumar

### Team Members

- Ayush
- Jatin Vishwakarma

---

## Demo Video

https://youtu.be/By-MtoYcXaM

---

## License

This project was developed for the Odoo Hackathon and educational purposes.
