# 🚀 Forma AI – AI-Augmented Dynamic Form Engine

## AI-Powered Dynamic Form Automation for Insurance & Healthcare Workflows

Forma AI is a full-stack AI-powered application that simplifies complex forms by converting **natural language** into **structured form data**. Instead of manually filling long insurance or healthcare forms, users describe their situation in plain English, and the AI automatically extracts key information and pre-fills the form. The remaining questions are displayed dynamically based on backend-defined rules stored in MongoDB.

---

## 📌 Project Overview

Large organizations such as insurance companies and hospitals use lengthy forms with multiple branching questions. Forma AI reduces form complexity by:

* Extracting structured information from user-written text using AI.
* Dynamically rendering only relevant questions.
* Validating user input based on backend JSON schemas.
* Saving submissions and drafts securely.

---

## ✨ Key Features

* 🤖 AI-powered natural language form autofill.
* 📄 Dynamic form generation from MongoDB JSON schemas.
* 🔀 Conditional question rendering (`showIf` logic).
* ✅ React Hook Form validation.
* 💾 Save draft and submit completed forms.
* 📱 Responsive React interface.

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Hook Form
* Zustand
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* LangChain
* OpenAI GPT API
* JWT Authentication

---

## 📁 Project Structure

```text
Forma-AI/
├── client/                 # React Frontend
├── server/                 # Node.js Backend
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside the `server` folder with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/forma-ai
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 👥 Project Team Members

| Member                                          | Responsibility                                                                          |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Member 1 (Team Leader)**                      | Project coordination, architecture design, API design, GitHub management, code reviews. |
| **Member 2 (Frontend Specialist)**              | React UI, Dynamic Form Renderer, reusable components, responsive design.                |
| **Member 3 (Backend Specialist)**               | Express server, REST APIs, authentication, form submission APIs.                        |
| **Member 4 (Database & Workflow Specialist)**   | MongoDB schemas, branching rules, validation logic, schema management.                  |
| **Member 5 (AI Specialist)**                    | LangChain integration, GPT prompt engineering, AI extraction API, JSON autofill.        |
| **Member 6 (State Management & QA Specialist)** | Zustand state management, validation, integration testing, deployment, documentation.   |

---

## 🎯 Future Enhancements

* Voice-to-form input.
* OCR document extraction.
* Image-based damage detection.
* Multi-language support.
* AI confidence scoring for extracted fields.

---

## 📄 License

This project is developed as an academic full-stack AI project for learning and demonstration purposes.
