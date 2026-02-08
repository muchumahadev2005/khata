const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const { errorHandler } = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://khata-pi.vercel.app",
];

// Restrict API calls to trusted origins and ensure preflight responses carry headers.
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* ================= MIDDLEWARE ================= */
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

module.exports = app;
