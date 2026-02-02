const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const {
  addTransaction,
  getTransactions
} = require("../controllers/transaction.controller");

router.post("/", auth, addTransaction);
router.get("/", auth, getTransactions);

module.exports = router;
