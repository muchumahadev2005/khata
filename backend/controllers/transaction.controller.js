const mongoose = require("mongoose");
const Customer = require("../models/Customer.model");
const Transaction = require("../models/Transaction.model");

// ➕ ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    // ✅ CHANGE HERE
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user id in token" });
    }

    // ✅ CHANGE HERE
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { name, phone, amount, type, description } = req.body;

    let customer = await Customer.findOne({ userId, phone });
    if (!customer) {
      customer = await Customer.create({ userId, name, phone });
    }

    const transaction = await Transaction.create({
      userId,
      customerId: customer._id,
      type,
      amount,
      description
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

// 📜 GET ALL TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    // ✅ CHANGE HERE
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user id in token" });
    }

    // ✅ CHANGE HERE
    const userId = new mongoose.Types.ObjectId(req.userId);

    const transactions = await Transaction.find({ userId })
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
