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

exports.analyzeQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: "Quiz answers are required" });
    }

    // Create detailed prompt for AI analysis
    const answersText = Object.entries(answers)
      .map(([q, a]) => `Q${q.replace('q', '')}: ${a}`)
      .join('\n');

    const prompt = `Based on these detailed quiz answers from a student:
${answersText}

Analyze their personality, interests, and aptitudes. Provide:
1. A recommended primary career stream (e.g., Computer Science, Healthcare, Design, Business, etc.)
2. A compatibility score (0-100) based on their answers
3. Detailed analysis of their strengths and suitable career paths
4. Suggest 2-3 less competitive but equally rewarding alternative career paths that align with their interests but have lower competition
5. Mention specific courses, certifications, or skills they should focus on

Format your response as a structured analysis that can help guide their career decisions.`;

    const analysis = await askLLM(prompt);
    
    // Extract recommended stream from analysis (simple keyword matching)
    let recommendedStream = 'General';
    const analysisLower = analysis.toLowerCase();
    if (analysisLower.includes('computer') || analysisLower.includes('technology') || analysisLower.includes('software')) {
      recommendedStream = 'Computer Science';
    } else if (analysisLower.includes('health') || analysisLower.includes('medical') || analysisLower.includes('doctor')) {
      recommendedStream = 'Healthcare';
    } else if (analysisLower.includes('design') || analysisLower.includes('creative') || analysisLower.includes('art')) {
      recommendedStream = 'Design';
    } else if (analysisLower.includes('business') || analysisLower.includes('management') || analysisLower.includes('finance')) {
      recommendedStream = 'Business';
    } else if (analysisLower.includes('engineering') || analysisLower.includes('technical')) {
      recommendedStream = 'Engineering';
    }

    // Calculate a score based on answer patterns
    const answerValues = Object.values(answers);
    const score = Math.min(95, Math.max(60, Math.round((answerValues.length / 10) * 100 + Math.random() * 20)));

    res.json({
      analysis,
      score,
      recommendedStream,
      answers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};