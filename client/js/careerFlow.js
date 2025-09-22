function getStoredPercentage(){
  const v = localStorage.getItem('quizPercentage');
  return v ? Number(v) : null;
}

function getStoredAnalysis(){
  const v = localStorage.getItem('quizAnalysis');
  return v ? JSON.parse(v) : null;
}

function getRecommendedStream(){
  return localStorage.getItem('recommendedStream') || 'General';
}

async function analyze(){
  const storedAnswers = localStorage.getItem('quizAnswers');
  const storedPercentage = getStoredPercentage();
  
  if (!storedAnswers && !storedPercentage) {
    // No quiz data available
    document.getElementById("loadingSection").style.display = "none";
    document.getElementById("errorSection").style.display = "block";
    return;
  }

  // Show loading animation
  let progress = 0;
  const progressBar = document.getElementById("progressBar");
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    progressBar.style.width = progress + "%";
  }, 200);

  try {
    let analysisText = "";
    
    if (storedAnswers) {
      // Send answers for detailed career trajectory analysis
      const res = await apiRequest("/career/trajectory", "POST", { answers: JSON.parse(storedAnswers) });
      analysisText = res.analysis;
    } else {
      // Fallback to stored analysis
      const storedAnalysis = getStoredAnalysis();
      if (storedAnalysis) {
        analysisText = storedAnalysis;
      } else {
        const res = await apiRequest("/career/analysis", "POST", { score: storedPercentage || 75 });
        analysisText = res.analysis;
      }
    }
    
    // Complete progress bar
    clearInterval(progressInterval);
    progressBar.style.width = "100%";
    
    // Wait a moment for smooth transition
    setTimeout(() => {
      document.getElementById("loadingSection").style.display = "none";
      document.getElementById("resultsSection").style.display = "block";
      
      // Update UI elements
      document.getElementById("analysisOutput").innerText = analysisText;
      document.getElementById("recommendedStream").innerText = getRecommendedStream();
      document.getElementById("compatibilityScore").innerText = (storedPercentage || 75) + "%";
      
      // Generate flowchart
      generateFlowchart();
    }, 500);
    
  } catch (error) {
    clearInterval(progressInterval);
    console.error('Analysis failed:', error);
    document.getElementById("loadingSection").style.display = "none";
    document.getElementById("errorSection").style.display = "block";
  }
}

async function generateFlowchart(){
  try {
    const recommendedStream = getRecommendedStream();
    const score = getStoredPercentage() || 75;
    
    const flowchartRes = await apiRequest("/llm/chat", "POST", { 
      message: `Create a Mermaid flowchart for career progression in ${recommendedStream} field for a student with score ${score}%. Focus on less competitive paths and alternative routes. Include steps like skill building, projects, internships, certifications, and job opportunities. Return only the Mermaid code starting with "graph TD" or "flowchart TD".`
    });
    
    const flowchartCode = flowchartRes.reply || `
      graph TD
      A[Now] --> B[Skill Building]
      B --> C[Projects]
      C --> D[Internships]
      D --> E[Certifications]
      E --> F[Job/Admissions]
    `;
    
    document.getElementById("flowchart").innerText = flowchartCode;
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
  } catch (err) {
    // Fallback flowchart if LLM fails
    document.getElementById("flowchart").innerText = `
      graph TD
      A[Now] --> B[Skill Building]
      B --> C[Projects]
      C --> D[Internships]
      D --> E[Certifications]
      E --> F[Job/Admissions]
    `;
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
  }
}

// Auto-start analysis when page loads
document.addEventListener('DOMContentLoaded', () => {
  analyze();
});
