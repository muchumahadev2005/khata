const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  // ⭐ Snapshot copy (VERY IMPORTANT)
  customerName: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    enum: ["DEBT", "PAYMENT"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 1,
  },

  description: {
    type: String,
    trim: true,
    default: "",
  },

}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
