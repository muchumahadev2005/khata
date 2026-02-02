const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { errorHandler } = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const transactionRoutes = require('./routes/transaction.routes');
const dashboardRoutes = require('./routes/dashboard.routes'); // ← ADD THIS

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

module.exports = app;
