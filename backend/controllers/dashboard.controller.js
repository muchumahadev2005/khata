// controllers/dashboard.controller.js
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction.model");
const Customer = require("../models/Customer.model");

exports.getDashboard = async (req, res) => {
  try {
    // ✅ FIX: use req.userId
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);

    // ✅ TOTAL CUSTOMERS
    const totalCustomers = await Customer.countDocuments({
      userId,
      isActive: true
    });

    // ✅ OUTSTANDING DEBT (DEBT - PAYMENT)
    const outstandingAgg = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          balance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "DEBT"] },
                "$amount",
                { $multiply: ["$amount", -1] }
              ]
            }
          }
        }
      }
    ]);

    const outstandingDebt = outstandingAgg[0]?.balance || 0;

    // ✅ TODAY'S TRANSACTIONS (12AM → 12AM)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todaysTransactions = await Transaction.countDocuments({
      userId,
      createdAt: { $gte: start, $lte: end }
    });

    res.json({
      totalCustomers,
      outstandingDebt,
      todaysTransactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
