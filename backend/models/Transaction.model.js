// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  type: { type: String, enum: ["DEBT", "PAYMENT"] },
  amount: Number,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
