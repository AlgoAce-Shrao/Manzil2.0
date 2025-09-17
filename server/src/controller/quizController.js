const QuizResult = require("../models/QuizResult");
const { askLLM } = require("../services/llmservice");

exports.submitQuiz = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    const prompt = `The following are quiz answers: ${JSON.stringify(answers)}. 
    Suggest 3 career options for this student with brief reasoning.`;

    const aiResponse = await askLLM(prompt);

    const result = await QuizResult.create({
      userId,
      answers,
      aiRecommendations: [aiResponse]
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
