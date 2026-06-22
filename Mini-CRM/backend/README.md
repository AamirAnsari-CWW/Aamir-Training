# Mini CRM Backend API

A secure and scalable CRM (Customer Relationship Management) backend built using Node.js, Express.js, MongoDB, JWT Authentication, and Nodemailer.

## Overview

This project is a Mini CRM Backend developed as part of a CRM Development Assignment. It provides APIs for managing customers, leads, user authentication, dashboard reporting, and email communication.

The application follows a layered architecture with separate modules for controllers, models, routes, middleware, validators, and utilities.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-Based Authorization

### Customer Management

* Create Customer
* View Customers
* Search Customers
* Update Customer
* Delete Customer (Admin Only)
* Pagination Support

### Lead Management

* Create Lead
* View Leads
* Search Leads
* Filter Leads by Status
* Filter Leads by Source
* Update Lead
* Delete Lead (Admin Only)

### Dashboard Reporting

* Total Customers
* Active Customers
* Inactive Customers
* Total Leads
* New Leads
* Contacted Leads
* Qualified Leads
* Converted Leads

### Email Communication

* Send Email to Customers or Leads
* SMTP Support using Nodemailer

### Security

* JWT Authentication
* Password Hashing using bcrypt
* Rate Limiting
* Input Validation
* Global Error Handling

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (jsonwebtoken)
* bcryptjs

### Validation

* express-validator

### Security

* express-rate-limit
* helmet
* cors

### Email

* Nodemailer

### Environment Management

* dotenv

---

## Project Structure

```txt
backend/
│
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── leadController.js
│   ├── dashboardController.js
│   └── emailController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── securityMiddleware.js
│   └── validationMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Customer.js
│   └── Lead.js
│
├── routes/
│   ├── authRoutes.js
│   ├── customerRoutes.js
│   ├── leadRoutes.js
│   ├── dashboardRoutes.js
│   └── emailRoutes.js
│
├── validators/
│   ├── authValidators.js
│   ├── customerValidators.js
│   ├── leadValidators.js
│   ├── emailValidators.js
│   └── commonValidators.js
│
├── utils/
│   ├── ApiError.js
│   ├── queryHelpers.js
│   └── sendEmail.js
│
├── .env
├── package.json
└── server.js
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/mini-crm

JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server:

```txt
http://localhost:5000
```

---

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

---

### Customers

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/customers     |
| GET    | /api/customers     |
| GET    | /api/customers/:id |
| PUT    | /api/customers/:id |
| DELETE | /api/customers/:id |

---

### Leads

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /api/leads     |
| GET    | /api/leads     |
| GET    | /api/leads/:id |
| PUT    | /api/leads/:id |
| DELETE | /api/leads/:id |

---

### Dashboard

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/dashboard |

---

### Email

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /api/email/send |

---

## Authentication

Protected routes require a JWT token.

Example:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Validation

The API validates:

* Email Format
* Password Strength
* MongoDB IDs
* Pagination Parameters
* Customer Inputs
* Lead Inputs
* Email Inputs

Invalid requests return structured validation errors.

---

## Error Handling

Centralized error handling is implemented for:

* Validation Errors
* Database Errors
* Duplicate Records
* JWT Errors
* Unauthorized Access
* Route Not Found
* Internal Server Errors

---

## Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Role-Based Authorization
* Rate Limiting
* Input Validation
* Protected Routes
* Secure Environment Variables

---

## Author

**Aamir Ansari**

Mini CRM Backend Development Assignment
   