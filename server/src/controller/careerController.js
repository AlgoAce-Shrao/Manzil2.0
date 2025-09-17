const { askLLM } = require("../services/llmservice");

exports.analyzeCareer = async (req, res) => {
  try {
    const { score } = req.body;
    const prompt = `A student scored ${score}% in a psychological career quiz. 
    Suggest the best career path, a flowchart of career progression, 
    and counselling-style insights.`;

    const response = await askLLM(prompt);
    res.json({ analysis: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await askLLM(`You are a career counselling chatbot. Answer: ${message}`);
    res.json({ reply: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
