const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./quizzes.db");
const crypto = require("crypto");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      questions TEXT
    )
  `);
});

function generateId(length = 8) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

function idExists(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT 1 FROM quizzes WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(!!row);
    });
  });
}

async function saveQuiz(questionsJson, id) {
  console.log(`Generated unique ID: ${id}`);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO quizzes (id, questions) VALUES (?, ?)`,
      [id, questionsJson],
      function (err) {
        if (err) return reject(err);
        resolve(id);
      }
    );
  });
}

function getQuizById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM quizzes WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { saveQuiz, getQuizById };
