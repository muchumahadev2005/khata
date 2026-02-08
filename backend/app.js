const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

/* ✅ SIMPLE CORS (works 100%) */
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginOpenerPolicy: false, // 🔥 fixes Google postMessage warning
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

module.exports = app;
