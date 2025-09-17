const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
const careerRoutes = require("./routes/career");
const collegeRoutes = require("./routes/colleges");
const { askLLM } = require("./services/llmservice");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/colleges", collegeRoutes);

// direct chatbot endpoint for dashboard
app.post("/api/llm/chat", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }
    const reply = await askLLM(`You are a career counselling chatbot. Answer briefly: ${message}`);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message || "LLM error" });
  }
});

app.get("/", (req, res) => res.send("Career Advisor API running ✅"));

module.exports = app;
