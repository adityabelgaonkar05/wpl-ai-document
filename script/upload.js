// script/upload.js

const uploadBtn = document.getElementById("trigger-upload");
const pdfInput = document.getElementById("pdf-input");

uploadBtn.addEventListener("click", () => {
  pdfInput.click();
});

pdfInput.addEventListener("change", async () => {
  const file = pdfInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      // redirect to quiz page
      window.location.href = `/quiz.html?quiz_id=${data.quiz_id}`;
    } else {
      alert(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
});
