const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,   // ✅ MUST BE ObjectId
    ref: "User",
    required: true
  },
  name: String,
  phone: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
