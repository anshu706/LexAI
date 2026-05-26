<div align="center">
  <h1>The LEX AI ⚖️</h1>
  
  <p>
    <strong>Empowering non-lawyers with clear, comprehensive, and instantaneous legal document analysis using Gemini AI.</strong>
  </p>

  <p>
    <a href="https://anshu706.github.io/LexAI/"><strong>Explore the Live App »</strong></a>
  </p>
  
  <br />
</div>

## 📖 Overview

**The LEX AI** is an intelligent document analysis platform tailored specifically for Indian contract law, tenancy agreements, and employment contracts. It simplifies complex legal jargon, extracts critical information, and highlights potential red flags in plain English. 

It acts as your personal AI legal assistant—giving you clarity and confidence before you sign.

---

## ✨ Key Features

- **📄 Seamless Document Parsing:** Upload PDF documents or paste contract text directly.
- **🧠 LLM Powered:** Built on the `gemini-2.5-flash` model for instant analysis.
- **🚨 Risk Level Highlighting:** Categorizes clauses into `CRITICAL`, `WARNING`, and `FINE` to quickly identify predatory terms.
- **💡 Plain English Explanations:** Strips away the legalese and explains exactly what a clause means and why it matters.
- **💬 Conversational Interface:** Chat directly with your document to ask specific questions about the terms.

---

## 🛠️ Tech Stack

### Frontend
- **React 19 & TypeScript:** Scalable, strictly-typed UI components.
- **Vite:** Lightning-fast frontend tooling.
- **Tailwind CSS & Framer Motion:** Beautiful styling with smooth, modern animations.
- **PDF.js:** Robust client-side PDF text extraction.

### Backend
- **Node.js & Express:** Lightweight backend to handle API routing and file processing securely.
- **GenAI SDK:** Direct integration with Gemini LLMs.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone & Install
```bash
git clone https://github.com/anshu706/LexAI.git
cd LexAI
npm install
```

### 2. Set up Environment Variables
Create a `.env` file in the root directory of the project and add your Gemini API Key:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. Run the Development Server
```bash
npm run dev
```
The application will be running locally at `http://localhost:3000`.

---

## 🌐 Deployment

The frontend of this application is deployed to GitHub Pages and can be accessed here:
**[https://anshu706.github.io/LexAI/](https://anshu706.github.io/LexAI/)**

> **Note:** The live GitHub Pages version contains only the static frontend. Local development with the Express server is required for the full API functionality.

---

## ⚠️ Disclaimer

*The LEX AI is designed for informational purposes and general analysis only. It does not provide certified legal advice. Always consult a qualified lawyer or legal professional before signing any legally binding documents.*
