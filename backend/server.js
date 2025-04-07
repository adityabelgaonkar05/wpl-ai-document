// backend/server.js

const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const cors = require("cors");

const { saveQuiz, getQuizById } = require("./db");
const { generateQuizFromText } = require("./gemini");

const app = express();
app.use(cors());
app.use(express.json());

// Store uploaded files in /uploads
const upload = multer({ dest: "uploads/" });

// Route to handle PDF upload and quiz generation
app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer || require("fs").readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text.slice(0, 30000); // Keep under Gemini token limit

    const quiz = await generateQuizFromText(extractedText);
    const quizId = await saveQuiz(JSON.stringify(quiz));

    res.json({ success: true, quiz_id: quizId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// ✅ New route to get quiz by ID
app.get("/api/quiz/:id", async (req, res) => {
  try {
    const quiz = await getQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
