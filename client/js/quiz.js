// Quiz data
const questions = [
  {
    id: 1,
    text: "Which of these activities excites you the most?",
    options: [
      { value: "A", text: "Solving a math puzzle" },
      { value: "B", text: "Designing an artwork or writing a story" },
      { value: "C", text: "Managing a budget or planning expenses" },
      { value: "D", text: "Helping a friend with their problems" }
    ]
  },
  {
    id: 2,
    text: "If you had to spend a day doing one thing, what would it be?",
    options: [
      { value: "A", text: "Running science experiments" },
      { value: "B", text: "Performing on stage / making videos" },
      { value: "C", text: "Playing a business simulation game" },
      { value: "D", text: "Volunteering at a community center" }
    ]
  },
  {
    id: 3,
    text: "Which subject do you find easiest to understand?",
    options: [
      { value: "A", text: "Mathematics / Physics" },
      { value: "B", text: "Arts / Literature" },
      { value: "C", text: "Economics / Accounts" },
      { value: "D", text: "Psychology / Social Studies" }
    ]
  },
  {
    id: 4,
    text: "Which skill comes most naturally to you?",
    options: [
      { value: "A", text: "Solving technical or logical problems" },
      { value: "B", text: "Expressing ideas creatively" },
      { value: "C", text: "Analyzing numbers and patterns" },
      { value: "D", text: "Understanding people's emotions" }
    ]
  },
  {
    id: 5,
    text: "How do you prefer working?",
    options: [
      { value: "A", text: "Following structured rules and systems" },
      { value: "B", text: "Having full freedom and creativity" },
      { value: "C", text: "Balancing structure with analysis" },
      { value: "D", text: "Collaborating closely with people" }
    ]
  },
  {
    id: 6,
    text: "How do you usually take decisions?",
    options: [
      { value: "A", text: "Based on data and logic" },
      { value: "B", text: "Based on creativity and imagination" },
      { value: "C", text: "Based on practicality and financial sense" },
      { value: "D", text: "Based on empathy and impact on others" }
    ]
  },
  {
    id: 7,
    text: "What motivates you the most in a career?",
    options: [
      { value: "A", text: "Discovering new knowledge / innovations" },
      { value: "B", text: "Expressing creativity and being unique" },
      { value: "C", text: "Financial stability and growth" },
      { value: "D", text: "Helping society and making a difference" }
    ]
  },
  {
    id: 8,
    text: "If offered two jobs, which would you choose?",
    options: [
      { value: "A", text: "A research job in a lab" },
      { value: "B", text: "A media/design startup role" },
      { value: "C", text: "A financial analyst in a bank" },
      { value: "D", text: "A teacher in a reputed school" }
    ]
  },
  {
    id: 9,
    text: "Which subject have you scored highest in till now?",
    options: [
      { value: "A", text: "Math/Science" },
      { value: "B", text: "Arts/English/History" },
      { value: "C", text: "Accounts/Economics/Business Studies" },
      { value: "D", text: "Biology/Psychology/Sociology" }
    ]
  },
  {
    id: 10,
    text: "How do you feel about preparing for competitive exams (NEET/JEE/UPSC)?",
    options: [
      { value: "A", text: "Excited and confident" },
      { value: "B", text: "Not interested, prefer creativity" },
      { value: "C", text: "Interested only in management-related exams" },
      { value: "D", text: "Unsure, but want guidance" }
    ]
  }
];

let currentQuestionIndex = 0;
let answers = {};

// Initialize quiz
function initQuiz() {
  showQuestion(0);
  updateProgress();
  updateControls();
}

// Show question directly without animations
function showQuestion(index) {
  const quizContent = document.getElementById('quizContent');
  const question = questions[index];

  // Create question card
  const questionCard = document.createElement('div');
  questionCard.className = 'question-card';
  questionCard.innerHTML = `
    <div class="question-front">
      <div class="question-number">Question ${question.id}</div>
      <div class="question-text">${question.text}</div>
      <div class="options">
        ${question.options.map(option => `
          <div class="option" data-value="${option.value}">
            <input type="radio" name="q${question.id}" value="${option.value}" id="q${question.id}_${option.value}">
            <label for="q${question.id}_${option.value}" class="option-text">${option.text}</label>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Clear previous content
  quizContent.innerHTML = '';
  quizContent.appendChild(questionCard);

  // Add event listeners to options
  const options = questionCard.querySelectorAll('.option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      const radio = option.querySelector('input[type="radio"]');
      radio.checked = true;
      
      // Remove selected class from all options
      options.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Store answer
      answers[`q${question.id}`] = radio.value;
      
      // Move to next question immediately
      moveToNextQuestion();
    });
  });

  updateQuestionCounter();
}

// Move directly to next question
function moveToNextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);
    updateProgress();
    updateControls();
  } else {
    // Quiz completed
    completeQuiz();
  }
}

// Update progress bar
function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

// Update question counter
function updateQuestionCounter() {
  document.getElementById('questionCounter').textContent = 
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

// Update control buttons
function updateControls() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = !answers[`q${questions[currentQuestionIndex].id}`];
  
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = 'Complete Quiz';
  } else {
    nextBtn.textContent = 'Next Question';
  }
}

// Complete quiz
async function completeQuiz() {
  // Hide quiz content and show completion
  document.getElementById('quizContent').style.display = 'none';
  document.querySelector('.quiz-controls').style.display = 'none';
  document.getElementById('completionSection').style.display = 'block';
  
  // Send answers to backend
  try {
    const res = await apiRequest("/quiz/analyze", "POST", { answers });
    
    // Store results
    localStorage.setItem('quizAnalysis', JSON.stringify(res.analysis));
    localStorage.setItem('quizPercentage', String(res.score || 75));
    localStorage.setItem('recommendedStream', res.recommendedStream || 'General');
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    
    // Redirect immediately
    setTimeout(() => {
      window.location.href = 'careerflow.html';
    }, 1000);
    
  } catch (error) {
    console.error('Quiz analysis failed:', error);
    // Fallback
    const percentage = Math.round((Object.keys(answers).length / 10) * 100);
    localStorage.setItem('quizPercentage', String(percentage));
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    
    setTimeout(() => {
      window.location.href = 'careerflow.html';
    }, 1000);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
  
  // Next button
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (answers[`q${questions[currentQuestionIndex].id}`]) {
      moveToNextQuestion();
    }
  });
  
  // Previous button
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
      updateProgress();
      updateControls();
    }
  });
});
