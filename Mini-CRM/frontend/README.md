# Mini CRM Frontend

Responsive React frontend for the Mini CRM Development Assignment.

The application demonstrates a working CRM prototype with authentication, dashboard reporting, customer management, lead tracking, email communication, reusable UI components, API integration, form validation, and responsive layouts.

## Business Scenario

The Mini CRM helps teams manage customer inquiries, sales opportunities, follow-up activity, dashboard reporting, user access, and direct customer communication from one interface.

## Completed Frontend Scope

- Dashboard with CRM summary statistics
- Customer management screens
- Lead management screens
- Send Email screen with recipient, subject, and message fields
- Login and registration pages
- Protected application routes
- Context API based authentication state
- API integration with the Node.js backend
- Form validation and user feedback
- Pagination and reusable status badges
- Responsive layout for desktop and mobile
- Centralized theme styling in `src/styles.css`

## Completed Backend Scope

The backend is implemented separately in `../backend` and includes:

- Node.js and Express.js REST APIs
- User, customer, lead, dashboard, and email modules
- JWT authentication
- MongoDB database design using Mongoose models
- Request validation
- Global error handling
- Security middleware
- Email delivery using Nodemailer
- API endpoint documentation in `../backend/README.md`

## Technology Stack

- React.js
- React Router
- Context API
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer
- Local server setup

## Project Structure

```txt
frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── index.html
├── package.json
└── README.md
```

## Setup

Install frontend dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Start the frontend:

```bash
npm run dev
```

The backend should run at:

```txt
http://localhost:5000
```

If your backend uses a different URL, update `VITE_API_URL` in `.env`.

## Build

Create a production build:

```bash
npm run build
```

## Application Pages

- Login
- Register
- Dashboard
- Customers
- Leads
- Send Email

## Expected Outcome

The project delivers a working CRM prototype demonstrating customer management, lead tracking, email communication, dashboard reporting, authentication, responsive UI, and scalable architecture.
