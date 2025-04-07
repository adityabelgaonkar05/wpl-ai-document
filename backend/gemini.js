// backend/gemini.js

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuizFromText(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Generate a quiz (5 questions max) from the following content:
"${text}"

Return output in strict JSON format like this:
[
  {
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B"
  },
  ...
]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const textResponse = response.text();

  // Extract JSON block (Gemini sometimes wraps with ```json)
  const cleanJson = textResponse.match(/\[.*\]/s)?.[0];
  return JSON.parse(cleanJson);
}

module.exports = { generateQuizFromText };
