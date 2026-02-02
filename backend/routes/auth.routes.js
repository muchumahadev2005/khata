const express = require("express");
const { googleAuth, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/google", googleAuth);
router.post("/login", login);

module.exports = router;
