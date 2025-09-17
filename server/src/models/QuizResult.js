const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: Array,
  aiRecommendations: Array,
}, { timestamps: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);
