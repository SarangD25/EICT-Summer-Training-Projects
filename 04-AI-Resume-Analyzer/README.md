# AI Resume Analyzer

A simple Python-based resume analyzer that extracts text from PDF resumes, compares resume skills with a given job description, calculates a basic match percentage score, and provides actionable improvement suggestions.

---

## 📌 Project Overview
This project is designed as a straightforward, beginner-friendly Python full-stack application built using **Streamlit**, **pypdf**, and **spaCy**. It helps job seekers evaluate how well their resume matches a target job description by analyzing technical skills and providing rule-based recommendations.

---

## ✨ Features
- **PDF Resume Parsing**: Extracts selectable text page-by-page from uploaded PDF resumes using `pypdf`.
- **NLP Text Cleaning**: Preprocesses text and cleans tokens using `spaCy`.
- **Skill Extraction & Matching**: Detects programming languages, frameworks, tools, and soft skills in both the resume and job description.
- **Match Score Calculation**: Computes a simple skill match percentage score based on matching skills vs required job skills.
- **Matched & Missing Skills Breakdown**: Clear visual lists showing matched skills and missing skills needed for the role.
- **Rule-Based Improvement Suggestions**: Instant actionable advice to tailor the resume.
- **Optional AI Suggestions**: Optional Gemini API integration for personalized advice (the core analyzer works 100% offline without any API key).

---

## 🛠️ Tech Stack
- **Language**: Python 3.10+
- **Frontend / UI**: Streamlit
- **PDF Parsing**: pypdf
- **NLP Processing**: spaCy (`en_core_web_sm`)
- **HTTP Calls (Optional LLM)**: Requests
- **Environment Config**: python-dotenv

---

## ⚙️ How It Works

```
  Uploaded Resume (PDF)                 Job Description (Text)
           │                                       │
           ▼                                       ▼
  extract_text_from_pdf()                  extract_skills()
           │                                       │
           ▼                                       │
   clean_text_with_spacy()                         │
           │                                       │
           └───────────────────┬───────────────────┘
                               │
                               ▼
                       extract_skills()
                               │
                               ▼
                   Compare Resume vs Job Skills
                               │
                               ▼
                      Match Score (%) = 
           (Matched Skills / Job Skills) * 100
                               │
                               ▼
                   Streamlit UI Presentation
```

### 🎓 Explanation for Viva / Presentation
1. **PDF Text Extraction**: Uses `pypdf.PdfReader` to extract raw text content from each page of the uploaded PDF file.
2. **Text Cleaning (spaCy)**: Tokenizes words, removes stop words (like "the", "is", "at") and punctuation to normalize the text.
3. **Skill Matching**: Checks the normalized text against a predefined skills dictionary (`SKILLS_DB`) using regex matching.
4. **Scoring Formula**:
   $$\text{Score} = \left(\frac{\text{Matched Skills Count}}{\text{Total Job Description Skills Count}}\right) \times 100$$
5. **Offline Reliability**: The scoring and skill identification are deterministic rule-based algorithms, ensuring fast and reliable operation without third-party API dependencies.

---

## 🚀 Installation & Setup

### 1. Clone or Download Repository
Navigate to the project root directory:
```bash
cd ai-resume-analyzer
```

### 2. Install Required Python Packages
```bash
pip install -r requirements.txt
```

### 3. Download spaCy English Language Model
```bash
python -m spacy download en_core_web_sm
```

### 4. Setup Environment Variables (Optional)
If you want to use the optional AI suggestions feature, create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

---

## 💻 How to Run

Launch the Streamlit web app:
```bash
streamlit run app.py
```

Open your web browser at `http://localhost:8501`.

---

## 📝 Example Usage
1. Click **"Browse files"** and select `sample_data/sample_resume.pdf` (or your own PDF resume).
2. Enter a Target Job Title, e.g., `Python Developer`.
3. Paste a Job Description containing skills like:
   > "We are looking for a Python Developer proficient in SQL, Docker, Pandas, Git, and AWS."
4. Click **"Analyze Resume"**.
5. View your **Match Score**, **Matched Skills**, **Missing Skills**, and **Improvement Suggestions**.

---

## 🔮 Future Improvements
- Expand `SKILLS_DB` to include specialized domain skills (e.g. Finance, Healthcare).
- Support DOCX file format parsing alongside PDF.
- Add chart visualization for skill category distributions.
