const { askLLM } = require("../services/llmservice");

exports.analyzeCareer = async (req, res) => {
  try {
    const { score } = req.body;
    const prompt = `A student scored ${score}% in a comprehensive career assessment quiz. 

Provide detailed career guidance focusing on:
1. Primary recommended career path based on their aptitude
2. 3-4 LESS COMPETITIVE alternative career paths that offer similar fulfillment and growth opportunities but with lower competition
3. Specific skills, courses, and certifications they should pursue
4. Industry insights about job market trends and emerging opportunities
5. Practical steps for the next 2-3 years to build their profile
6. Mentorship and networking opportunities in their chosen field

Emphasize alternative paths that are equally rewarding but have less competition than traditional routes. Include both mainstream and emerging career options.`;

    const response = await askLLM(prompt);
    res.json({ analysis: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.analyzeTrajectory = async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: "Quiz answers are required" });
    }

    // Create detailed prompt for career trajectory analysis
    const answersText = Object.entries(answers)
      .map(([q, a]) => `Q${q.replace('q', '')}: ${a}`)
      .join('\n');

    const prompt = `Based on these quiz answers from a student:
${answersText}

Create a comprehensive career trajectory analysis including:

1. **Primary Career Recommendation**: Based on their answers, suggest the most suitable career path with detailed reasoning

2. **Multiple Career Trajectories**: Provide 3-4 different pathways to achieve this career:
   - Traditional/Conventional Path (standard route)
   - Alternative/Niche Path (less competitive, unique opportunities)
   - Skill-Based Path (focus on specific competencies)
   - Entrepreneurship/Innovation Path (building own opportunities)

3. **Timeline & Milestones**: For each trajectory, outline:
   - Year 1: Immediate actions and skill development
   - Year 2-3: Intermediate goals and experiences
   - Year 4-5: Advanced positioning and specialization

4. **Specific Action Items**: Concrete steps they should take:
   - Courses and certifications to pursue
   - Projects to work on
   - Networks to build
   - Skills to develop
   - Opportunities to seek

5. **Market Insights**: Current trends, growth areas, and emerging opportunities in their chosen field

6. **Risk Mitigation**: Alternative plans if primary path doesn't work out

Make this analysis actionable, specific, and tailored to their unique profile based on the quiz responses.`;

    const analysis = await askLLM(prompt);
    
    res.json({ analysis });
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
