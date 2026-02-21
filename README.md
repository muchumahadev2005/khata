# 💰 Khata – Secure Expense Management System

Khata is a full-stack expense management web application designed to securely manage and track financial transactions.

The system implements both traditional authentication and Google OAuth-based authentication, along with JWT-based authorization and structured REST API design.

🌐 Live Demo: https://khata-pi.vercel.app/  
🔗 GitHub Repository: https://github.com/muchumahadev2005/khata

---

## 🚀 Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Axios (API Communication)
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt Password Hashing
- Google OAuth Integration
- MVC Architecture
- Environment Variables (.env)

---

## 🔐 Core Features

- Secure User Registration & Login
- Google OAuth-Based Authentication
- JWT-Based Authorization System
- Password Encryption using bcrypt
- Middleware-Protected API Routes
- CRUD Operations for Expense Tracking
- User-Specific Data Isolation
- Environment-Based Secure Configuration
- Full-Stack Deployment

---

## 👥 Authentication System

Khata supports two authentication methods:

### 1️⃣ Traditional Authentication
- User registers with email & password
- Password hashed using bcrypt
- JWT token generated upon login
- Protected routes validated using middleware

### 2️⃣ Google Authentication (OAuth)
- Users can log in via Google
- Google token validated on backend
- Secure session established using JWT
- User record stored in MongoDB

All protected routes require valid JWT verification.

---

## 📡 Key API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google

### Transactions
- GET /api/transactions
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

All transaction routes require valid authentication.

---

## 🏗️ Architecture

Backend follows MVC architecture:

- Models → Database Schemas
- Controllers → Business Logic
- Routes → API Endpoints
- Middleware → Authentication & Authorization

This modular structure ensures scalability and maintainability.

---

## 🔒 Security Practices

- Password hashing using bcrypt
- Google OAuth token validation
- JWT-based authorization
- Middleware-protected routes
- Secure environment variable management
- User-level data isolation

---

## ⚙️ Local Development Setup

Clone the repository:

git clone https://github.com/muchumahadev2005/khata
cd khata
npm install


Run the application:

npm run dev

---

## 🎯 Project Objective

Khata was developed to demonstrate secure backend engineering practices including authentication systems, REST API design, financial transaction management, and full-stack deployment.

---

## 👨‍💻 Author

Mahadev Muchu  
GitHub: https://github.com/muchumahadev2005  
LinkedIn: https://www.linkedin.com/in/mahadev-muchu-a08021375
