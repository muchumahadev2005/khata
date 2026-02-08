const express = require("express");
const cors = require("cors");
const { googleAuth, login } = require("../controllers/auth.controller");

const router = express.Router();

/* 🔥 PRE-FLIGHT */
router.options("/google", cors());

router.post("/google", googleAuth);
router.post("/login", login);

module.exports = router;
