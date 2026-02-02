# Smart Credit Speak Backend

This is the backend for the Smart Credit Speak application. It is built using Node.js, Express, and MongoDB.

## Features
- User authentication
- Customer management
- Transaction management

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart-credit-speak
   JWT_SECRET=your_jwt_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the API at `http://localhost:5000/api`.

## Scripts
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon

## Folder Structure
- `src/`
  - `app.js`: Express app configuration
  - `server.js`: Server entry point
  - `config/`: Configuration files (e.g., database, environment variables)
  - `models/`: Mongoose schemas
  - `controllers/`: Business logic
  - `routes/`: API routes
  - `middlewares/`: Middleware functions
  - `utils/`: Utility functions
  - `constants/`: Constants (e.g., HTTP status codes)

## Dependencies
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- dotenv
- cors
- helmet

## Dev Dependencies
- nodemon