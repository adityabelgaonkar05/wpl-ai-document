# AI Document Quiz Generator

A web application that converts PDF documents into interactive quizzes using AI technology.

## Team Members

- Akanksha Agroya - 16010123031
- Aditya Belgaonkar - 16010123026
- Anam Khan - 16010123039

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js
- SQLite (for database)

### AI Integration
- Google Gemini API (for quiz generation)

## Packages Used

### Backend
- express: Web server framework
- multer: File upload handling
- pdf-parse: PDF text extraction
- cors: Cross-origin resource sharing
- sqlite3: Database management
- @google/generative-ai: Gemini AI integration
- dotenv: Environment variable management

## Data Flow

1. **User uploads a PDF**:
   - PDF is uploaded from frontend to backend
   - Frontend generates a unique ID for the quiz

2. **Backend processing**:
   - PDF text is extracted using pdf-parse
   - Text is sent to Gemini AI to generate quiz questions
   - Quiz data and ID are stored in SQLite database

3. **Quiz retrieval**:
   - Frontend redirects to quiz page with the unique ID
   - Quiz page fetches quiz data from backend using the ID
   - Implements retry mechanism if quiz is still being generated

4. **Quiz interaction**:
   - User answers questions
   - Results are calculated and displayed on submission

## How to Run the Application

1. **Setup the backend**:
   ```cd backend
   npm install
   npm start
2. **Frontend**:
   - Simply open index.html

## Features

- PDF document upload and conversion to quiz
- AI-powered quiz generation
- Unique quiz IDs for sharing
- Interactive quiz interface with score calculation
- Automatic retrying for quiz data that's still processing