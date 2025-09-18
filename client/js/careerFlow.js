function getStoredPercentage(){
  const v = localStorage.getItem('quizPercentage');
  return v ? Number(v) : null;
}

async function analyze(score){
  const res = await apiRequest("/career/analysis", "POST", { score });
  document.getElementById("analysisOutput").innerText = res.analysis;
  
  // Generate AI flowchart
  try {
    const flowchartRes = await apiRequest("/llm/chat", "POST", { 
      message: `Create a Mermaid flowchart for career progression starting from current student status with score ${score}%. Include steps like skill building, projects, internships, certifications, and job opportunities. Return only the Mermaid code starting with "graph TD" or "flowchart TD".`
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

const btn = document.getElementById("analyzeBtn");
btn.addEventListener("click", async () => {
  const score = Number(document.getElementById("scoreInput").value || 0);
  await analyze(score);
});

// Auto-fill from quiz
const stored = getStoredPercentage();
if (stored !== null) {
  document.getElementById("scoreInput").value = String(stored);
  analyze(stored);
}
