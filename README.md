# Forma AI

## AI-Powered Dynamic Form Engine

Forma AI is an AI-powered dynamic form platform designed to simplify complex forms used in domains such as **Insurance and Healthcare**.

Traditional enterprise forms can contain 50+ questions with complex branching logic, where one answer determines which questions appear next. Forma AI reduces this complexity by allowing users to describe their situation naturally. The backend uses an LLM to convert the user's unstructured description into structured form data and dynamically determines which questions are required.

---

## Problem Statement

Large organizations such as insurance and healthcare companies depend on massive, branching forms.

For example:

* Question 12 determines whether Questions 13–20 should appear.
* Users have to manually select information from many dropdowns.
* Complex validation makes the frontend difficult to maintain.
* Managing conditional form state becomes difficult as the number of questions increases.
* Unstructured user input cannot easily be mapped to structured database fields.

Forma AI solves this by combining **AI-powered information extraction** with a **dynamic JSON form engine**.

---

## Example

Instead of filling out multiple fields manually, a user can enter:

> I hit a deer on I-95 yesterday in my Honda, and the windshield shattered.

The AI analyzes the text and extracts structured information:

```json
{
  "incidentType": "animal_collision",
  "vehicle": "Honda",
  "damage": ["windshield"],
  "location": "I-95",
  "incidentDate": "2026-08-26"
}
```

The React frontend can then automatically pre-fill these fields.

The backend evaluates the form schema and returns only the questions that are still required.

---

## Key Features

### AI Natural Language Processing

Users can describe an incident using normal language instead of manually completing dozens of fields.

### AI Form Prefilling

The AI converts unstructured text into structured JSON.

Example:

```text
"I hit a deer on I-95 in my Honda."
```

becomes:

```json
{
  "incidentType": "animal_collision",
  "vehicle": "Honda",
  "location": "I-95"
}
```

### Dynamic Forms

Form structures are stored as JSON schemas in MongoDB.

The frontend does not need to hardcode every question.

### Conditional Questions

Questions can contain conditions such as:

```json
{
  "id": "animalType",
  "label": "Which animal was involved?",
  "type": "select",
  "showIf": {
    "incidentType": "animal_collision"
  }
}
```

The question is displayed only when:

```text
incidentType = animal_collision
```

### Dynamic Validation

The backend validates answers according to the form schema.

Only relevant and visible fields need to be validated.

### Draft Saving

Users can save incomplete forms and continue later.

### Form Submission

Completed forms are stored in MongoDB.

### Authentication

JWT-based authentication protects user-specific form submissions.

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* Google Gemini API

### Authentication

* JSON Web Token (JWT)
* bcryptjs

---

## Project Structure

```text
Forma-Ai/
│
├── client/
│   └── React Frontend
│
├── server/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── gemini.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── formController.js
│   │   ├── aiController.js
│   │   └── submissionController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── FormSchema.js
│   │   ├── FormSubmission.js
│   │   └── AIExtraction.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── formRoutes.js
│   │   ├── aiRoutes.js
│   │   └── submissionRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── services/
│   │   ├── aiParserService.js
│   │   ├── visibilityEngine.js
│   │   └── validationEngine.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── response.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## Backend Architecture

```text
User
  │
  ▼
Natural Language Input
  │
  ▼
AI Parser
  │
  ▼
Structured JSON
  │
  ▼
Form Schema
  │
  ▼
Visibility Engine
  │
  ▼
Required Questions
  │
  ▼
Validation Engine
  │
  ▼
Form Submission
  │
  ▼
MongoDB
```

---

## API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Chandra Mahesh",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
```

---

### Forms

#### Get Form Schema

```http
GET /api/forms/:formId
```

Returns the dynamic JSON form schema.

#### Get Visible Fields

```http
POST /api/forms/visible-fields
```

Request:

```json
{
  "formId": "insurance-claim",
  "answers": {
    "incidentType": "animal_collision"
  }
}
```

The backend returns only the questions that should currently be displayed.

---

### AI

#### AI Form Prefill

```http
POST /api/ai/prefill
```

Request:

```json
{
  "description": "I hit a deer on I-95 yesterday in my Honda, and the windshield shattered."
}
```

Response:

```json
{
  "message": "AI fields extracted successfully.",
  "extractedData": {
    "incidentType": "animal_collision",
    "vehicle": "Honda",
    "damage": ["windshield"],
    "location": "I-95"
  }
}
```

---

### Submissions

#### Save Draft

```http
POST /api/submissions/draft
```

#### Submit Form

```http
POST /api/submissions/submit
```

#### Get User Submissions

```http
GET /api/submissions
```

---

## MongoDB Models

### User

Stores:

* Name
* Email
* Password
* Role

### FormSchema

Stores:

* Form ID
* Form title
* Questions
* Question types
* Options
* Required fields
* Conditional visibility rules

### FormSubmission

Stores:

* User
* Form ID
* Answers
* Submission status
* Created/updated timestamps

### AIExtraction

Stores:

* Original user description
* Extracted fields
* Form ID
* User
* AI confidence information

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Chandra99275/Forma-Ai.git
```

Navigate to the backend:

```bash
cd Forma-Ai/server
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/forma_ai

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

Do not commit `.env` to GitHub.

---

## Running the Backend

Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

Test the server:

```http
GET http://localhost:5000/
```

Expected response:

```json
{
  "message": "Forma AI Backend is Running 🚀"
}
```

---

## Example Form Schema

A form can be stored in MongoDB like this:

```json
{
  "formId": "insurance-claim",
  "title": "Insurance Claim",
  "questions": [
    {
      "id": "incidentType",
      "label": "What happened?",
      "type": "select",
      "options": [
        "animal_collision",
        "vehicle_collision",
        "theft",
        "fire"
      ],
      "required": true
    },
    {
      "id": "animalType",
      "label": "Which animal was involved?",
      "type": "select",
      "options": [
        "Deer",
        "Dog",
        "Cow",
        "Other"
      ],
      "showIf": {
        "incidentType": "animal_collision"
      }
    },
    {
      "id": "windshieldDamage",
      "label": "Was the windshield damaged?",
      "type": "boolean",
      "showIf": {
        "damage": "windshield"
      }
    }
  ]
}
```

---

## Future Improvements

* Advanced multi-condition branching
* AI confidence scoring per field
* Document and image analysis
* OCR for insurance documents
* Healthcare form support
* Admin form builder
* Form versioning
* Audit logs
* Role-based access control
* Redis caching
* Real-time autosave
* AI-powered form recommendations

---

## Project Goal

Forma AI aims to make complex enterprise forms **simpler, faster, and more intelligent** by combining:

**Natural Language → AI Extraction → Dynamic Form → Conditional Questions → Validation → Submission**

The system allows organizations to maintain complex forms while providing users with a much simpler conversational input experience.

---

## Author

**Yarlagadda Chandra Mahesh Goud**

GitHub: `https://github.com/Chandra99275`

---

## License

This project is developed for educational and demonstration purposes.
