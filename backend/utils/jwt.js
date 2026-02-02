const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),   // ✅ FIX: convert ObjectId → string
      email: user.email,
      provider: user.provider
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"           // optional (better UX)
    }
  );
};
