require("dotenv").config(); // Make sure to load .env variables

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Manzil",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  GROQ_API_KEY: process.env.GROQ_API_KEY // remove "" fallback
};
