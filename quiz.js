// Extract quiz_id from URL (e.g., /quiz.html?quiz_id=1)
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quiz_id");

const quizContainer = document.getElementById("quiz");
const submitButton = document.getElementById("submit");
const resultContainer = document.getElementById("result");

let quizData = [];
let userAnswers = [];

async function loadQuiz() {
  const res = await fetch(`http://localhost:3000/api/quiz/${quizId}`);
  const data = await res.json();
  quizData = data.quiz;
  console.log(quizData);
  quizContainer.innerHTML = quizData
    .map((q, index) => `
      <div class="question-block">
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="q${index}" value="${opt}">
            ${opt}
          </label><br/>
        `).join('')}
      </div>
    `).join('');
}

submitButton.addEventListener("click", () => {
  const allInputs = document.querySelectorAll("input[type=radio]:checked");
  userAnswers = Array.from(allInputs).map(input => input.value);

  let score = 0;
  const feedback = quizData.map((q, index) => {
    const isCorrect = userAnswers[index] === q.answer;
    if (isCorrect) score++;
    return `Q${index + 1}: Your Answer - ${userAnswers[index]}, Correct - ${q.answer}`;
  }).join("<br/>");

  resultContainer.innerHTML = `
    <h3>Your Score: ${score} / ${quizData.length}</h3>
    <p>${feedback}</p>
  `;
});

loadQuiz();
