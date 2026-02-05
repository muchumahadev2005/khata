const mongoose = require("mongoose");
const Customer = require("../models/Customer.model");
const Transaction = require("../models/Transaction.model");

// ➕ ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user id in token" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const { customerName, phoneNumber, amount, type, description } = req.body;

    // Step 1: basic validation
    if (!customerName || !String(customerName).trim()) {
      return res.status(400).json({ message: "Customer name is required" });
    }
    if (!phoneNumber || !String(phoneNumber).trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (amount == null) {
      return res.status(400).json({ message: "Amount is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const normalizedName = String(customerName).trim();
    const normalizedPhone = String(phoneNumber).trim();

    // Always store transaction type in uppercase for consistency
    const normalizedType = String(type).toUpperCase(); // "DEBT" | "PAYMENT"

    // Step 2: find customer by userId + phoneNumber only
    let customer = await Customer.findOne({ userId, phone: normalizedPhone });

    // Step 3: create customer if not found
    if (!customer) {
      customer = await Customer.create({
        userId,
        name: normalizedName,
        phone: normalizedPhone,
      });
    }

    // Step 4: create transaction snapshotting customerName
    const transaction = await Transaction.create({
      userId,
      customerId: customer._id,
      customerName: normalizedName,
      type: normalizedType,
      amount,
      description,
    });

    const populated = await transaction.populate("customerId", "name phone");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

// 📜 GET ALL TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user id in token" });
    }

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
