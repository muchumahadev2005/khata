const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    trim: true,
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });


// ⭐ Prevent duplicate phone PER USER
// ⭐ Works only when phone exists
customerSchema.index(
  { userId: 1, phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $type: "string" }
    }
  }
);

module.exports = mongoose.model("Customer", customerSchema);
