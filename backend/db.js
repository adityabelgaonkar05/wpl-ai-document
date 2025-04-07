// backend/db.js

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./quizzes.db");

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questions TEXT
    )
  `);
});

function saveQuiz(questionsJson) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO quizzes (questions) VALUES (?)`,
      [questionsJson],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID); // return quiz_id
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
