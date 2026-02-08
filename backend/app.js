const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const { errorHandler } = require("./middlewares/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://khata-pi.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ PRE-FLIGHT SUPPORT (THIS FIXES YOUR ISSUE)
app.options("*", cors());

/* ================= OTHER MIDDLEWARE ================= */
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

module.exports = app;
