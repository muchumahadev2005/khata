const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { generateToken } = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =======================
// LOGIN (Email + Password)
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.provider === "google") {
      return res.status(400).json({ message: "Please login using Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GOOGLE AUTH ✅ CORRECTED
// =======================
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 🔍 FIND OR CREATE USER IN DB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "google",
        password: null,
      });
    }

    // 🔑 JWT MUST USE MongoDB _id
    const jwtToken = generateToken(user);

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};
