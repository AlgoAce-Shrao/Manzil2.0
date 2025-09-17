require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
      startServer();
    })
    .catch(err => {
      console.error("DB error:", err);
      console.log("⚠️ Starting server without database connection.");
      startServer();
    });
} else {
  console.log("ℹ️ MONGODB_URI not set. Starting server without database connection.");
  startServer();
}
