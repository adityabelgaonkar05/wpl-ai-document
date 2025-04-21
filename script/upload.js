// script/upload.js

const uploadBtn = document.getElementById("trigger-upload");
const pdfInput = document.getElementById("pdf-input");

// Simple function to generate an 8-character ID
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

uploadBtn.addEventListener("click", () => {
  pdfInput.click();
});

pdfInput.addEventListener("change", () => {
  const file = pdfInput.files[0];
  if (!file) return;

  const generatedId = generateId();
  console.log("Generated ID:", generatedId);

  const formData = new FormData();
  formData.append("pdf", file);
  formData.append("generatedId", generatedId);

  fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData
  });

  setTimeout(() => {
    window.location.href = `/quiz.html?quiz_id=${generatedId}`;
  }, 500);
});