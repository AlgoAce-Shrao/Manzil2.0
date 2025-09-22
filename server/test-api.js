const { askLLM } = require("./src/services/llmservice");

async function testAPI() {
  console.log("Testing OpenAI API integration...");
  
  try {
    // Test basic functionality
    const testPrompt = "Hello, can you provide a brief career guidance response?";
    const response = await askLLM(testPrompt);
    
    console.log("✅ API Test Successful!");
    console.log("Response:", response.substring(0, 200) + "...");
    
    // Test quiz analysis
    console.log("\nTesting Quiz Analysis...");
    const quizPrompt = `Based on these detailed quiz answers from a student:
Q1: A
Q2: B
Q3: C
Q4: A
Q5: B

Analyze their personality, interests, and aptitudes. Provide:
1. A recommended primary career stream
2. A compatibility score (0-100)
3. Detailed analysis of their strengths and suitable career paths
4. Suggest 2-3 less competitive but equally rewarding alternative career paths
5. Mention specific courses, certifications, or skills they should focus on`;

    const quizResponse = await askLLM(quizPrompt);
    console.log("✅ Quiz Analysis Test Successful!");
    console.log("Quiz Response:", quizResponse.substring(0, 300) + "...");
    
    // Test flowchart generation
    console.log("\nTesting Flowchart Generation...");
    const flowchartPrompt = `Create a Mermaid flowchart for career progression in Computer Science field for a student with score 85%. Focus on less competitive paths and alternative routes. Include steps like skill building, projects, internships, certifications, and job opportunities. Return only the Mermaid code starting with "graph TD" or "flowchart TD".`;
    
    const flowchartResponse = await askLLM(flowchartPrompt);
    console.log("✅ Flowchart Generation Test Successful!");
    console.log("Flowchart Response:", flowchartResponse.substring(0, 200) + "...");
    
  } catch (error) {
    console.error("❌ API Test Failed:", error.message);
  }
}

testAPI();
