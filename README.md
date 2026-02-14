Smart Credit Speak (Khata App)

A modern full-stack credit management system for small shops to track customer debts and payments.

Built with:

⚛️ React (Vite + TypeScript)

🟢 Node.js + Express

🍃 MongoDB (Mongoose)

🔐 Google OAuth Authentication

🎨 Tailwind CSS

🚀 Features
🔐 Authentication

Google Sign-In (OAuth 2.0)

JWT-based authentication

Protected API routes

👥 Customer Management

Add customers automatically on transaction

Soft delete customers

Search customers

Real-time balance calculation

💸 Transactions

Add Debt (customer owes money)

Add Payment (customer paid money)

Automatic balance calculation

Transaction history view

📊 Dashboard

Total customers

Outstanding debt

Today's transactions (resets every 24 hours)

🏗️ Project Structure
KHATA/
│
├── frontend/        → React + Vite app
│   ├── src/
│   └── .env
│
├── backend/         → Node + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── .env
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/your-username/khata-app.git
cd khata-app

2️⃣ Backend Setup
cd backend
npm install


Create .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret


Start backend:

npm run dev

3️⃣ Frontend Setup
cd frontend
npm install


Create .env file inside frontend:

VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=http://localhost:5000


Start frontend:

npm run dev


Frontend runs at:

http://localhost:8080


Backend runs at:

http://localhost:5000

🔐 Google OAuth Setup

Go to Google Cloud Console

Create OAuth 2.0 Client (Web Application)

Add Authorized JavaScript Origins:

http://localhost:8080


Copy Client ID into:

backend .env

frontend .env

⚠️ Never expose CLIENT_SECRET in frontend.

🧠 How Authentication Works

User logs in using Google

Google returns ID token

Frontend sends ID token to backend

Backend verifies token using Google

Backend issues JWT

JWT stored in localStorage

All protected routes require JWT

📌 API Endpoints
🔐 Auth
POST /api/auth/google

👥 Customers
GET /api/customers
DELETE /api/customers/:id

💸 Transactions
POST /api/transactions
GET /api/transactions

📊 Dashboard
GET /api/dashboard

🛡️ Security

Google ID token verified on backend

JWT protected routes

Sensitive keys stored in .env

Client ID is public by design

Client Secret never exposed

📈 Future Improvements

Monthly reports

SMS reminders

Export to PDF

Mobile app (APK)

AWS deployment

Role-based access

🧑‍💻 Author

Mahadev
Full-Stack Developer (React + Node.js + MongoDB
