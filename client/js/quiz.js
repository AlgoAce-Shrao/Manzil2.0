document.getElementById("quizForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const answers = {};
  formData.forEach((val, key) => answers[key] = val);

  // Simple scoring: Yes = 1, No = 0; percentage over 4 questions
  const yesCount = [answers.q1, answers.q2, answers.q3, answers.q4].filter(v => v === 'Yes').length;
  const percentage = Math.round((yesCount / 4) * 100);

  localStorage.setItem('quizPercentage', String(percentage));
  alert(`Quiz submitted! Your score: ${percentage}%`);
  window.location.href = 'careerflow.html';
});
