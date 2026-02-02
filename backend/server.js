require("dotenv").config(); // MUST be first

const app = require("./app");
const connectDB = require("./config/db"); // 👈 NO destructuring

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
