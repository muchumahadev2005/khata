const mongoose = require("mongoose");
const Customer = require("../models/Customer.model");

exports.getCustomers = async (req, res) => {
  try {
    // ✅ FIX: use req.userId
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);

    const customers = await Customer.aggregate([
      {
        $match: {
          userId,
          isActive: true
        }
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "customerId",
          as: "transactions"
        }
      },
      {
        $addFields: {
          balance: {
            $sum: {
              $map: {
                input: "$transactions",
                as: "t",
                in: {
                  $cond: [
                    { $eq: ["$$t.type", "DEBT"] },
                    "$$t.amount",
                    { $multiply: ["$$t.amount", -1] }
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

exports.deleteCustomer = async (req, res) => {
  await Customer.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "Customer deleted" });
};
