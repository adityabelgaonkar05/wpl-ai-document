// Extract quiz_id from URL (e.g., /quiz.html?quiz_id=1)
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quiz_id");

const quizContainer = document.getElementById("quiz");
const submitButton = document.getElementById("submit");
const resultContainer = document.getElementById("result");

let quizData = [];
let userAnswers = [];
let attemptCount = 0;
const maxAttempts = 15; // Maximum 15 attempts (15 seconds)

// Create a loading spinner
function createLoadingSpinner() {
  quizContainer.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading quiz data...</p>
      <p class="attempt-counter">Attempt: 1/${maxAttempts}</p>
    </div>
  `;
  
  // Add CSS for the spinner directly in the JS
  if (!document.getElementById('spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'spinner-styles';
    style.textContent = `
      .loading-container {
        text-align: center;
        padding: 30px;
      }
      .spinner {
        border: 6px solid #f3f3f3;
        border-top: 6px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px auto;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .attempt-counter {
        color: #666;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }
}

async function loadQuiz() {
  submitButton.style.display = 'none'; // Hide submit button while loading
  createLoadingSpinner();
  
  attemptCount = 0;
  fetchQuizWithRetry();
}

async function fetchQuizWithRetry() {
  attemptCount++;
  
  // Update attempt counter
  const counterElement = document.querySelector('.attempt-counter');
  if (counterElement) {
    counterElement.textContent = `Attempt: ${attemptCount}/${maxAttempts}`;
  }
  
  try {
    const res = await fetch(`http://localhost:3000/api/quiz/${quizId}`);
    const data = await res.json();
    
    // Check if we got valid quiz data
    if (!data || !data.questions) {
      handleMissingData();
      return;
    }
    
    quizData = typeof data.questions === "string" ? JSON.parse(data.questions) : data.questions;
    
    if (quizData && quizData.length > 0) {
      renderQuiz();
      submitButton.style.display = 'block'; // Show submit button now that we have data
    } else {
      handleMissingData();
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    handleMissingData();
  }
}

function handleMissingData() {
  if (attemptCount >= maxAttempts) {
    quizContainer.innerHTML = `
      <div class="error-message">
        <h3>Could not load quiz data</h3>
        <p>The quiz might still be processing or the ID may be invalid.</p>
        <button id="retry-button">Try Again</button>
      </div>
    `;
    document.getElementById('retry-button').addEventListener('click', loadQuiz);
  } else {
    // Retry after 1 second
    setTimeout(fetchQuizWithRetry, 1000);
  }
}

function renderQuiz() {
  quizContainer.innerHTML = quizData
  .map(
    (q, index) => `
    <div class="question-block">
      <p class="question"><strong>Q${index + 1}:</strong> ${q.question}</p>
      <div class="options">
        ${q.options
          .map(
            (opt, i) => `
            <label class="option">
              <input type="radio" name="q${index}" value="${opt}">
              ${opt}
            </label>
          `
          )
          .join('')}
      </div>
    </div>
  `
  )
  .join('');
}

submitButton.addEventListener("click", () => {
  const allInputs = document.querySelectorAll("input[type=radio]:checked");
  userAnswers = Array.from(allInputs).map(input => input.value);

  let score = 0;
  const feedback = quizData.map((q, index) => {
    const isCorrect = userAnswers[index] === q.answer;
    if (isCorrect) score++;
    return `Q${index + 1}: Your Answer - ${userAnswers[index] || 'No answer'}, Correct - ${q.answer}`;
  }).join("<br/>");

  resultContainer.innerHTML = `
    <h3>Your Score: ${score} / ${quizData.length}</h3>
    <p>${feedback}</p>
  `;
});

// Start loading when the page loads
loadQuiz();
