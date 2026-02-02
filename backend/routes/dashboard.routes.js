const express = require("express");
const router = express.Router();   // ✅ REQUIRED

const auth = require("../middlewares/auth.middleware");
const { getDashboard } = require("../controllers/dashboard.controller");

// GET dashboard data
router.get("/", auth, getDashboard);

module.exports = router;
