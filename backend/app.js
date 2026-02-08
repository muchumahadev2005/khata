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

/* ================= MIDDLEWARE ================= */

// ✅ SIMPLE CORS (LIKE OLD PROJECT)
app.use(cors());

// optional but safe
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

module.exports = app;
