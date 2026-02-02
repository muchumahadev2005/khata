const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");

// 👇 THIS MUST MATCH controller exports EXACTLY
const {
  getCustomers,
  deleteCustomer
} = require("../controllers/customer.controller");

// GET all customers
router.get("/", auth, getCustomers);

// DELETE customer (soft delete)
router.delete("/:id", auth, deleteCustomer);

module.exports = router;
