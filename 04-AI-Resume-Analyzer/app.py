"""
app.py
------
Main Streamlit interface for the AI Resume Analyzer application.
Provides simple PDF file upload, job description input, skill matching analysis,
match score visualization, and improvement suggestions.
"""

import os
import streamlit as st
from dotenv import load_dotenv
from resume_parser import extract_text_from_pdf, clean_text_with_spacy
from analyzer import analyze_resume, get_optional_llm_suggestions

# Load environment variables
load_dotenv()

# Set Streamlit page configuration
st.set_page_config(
    page_title="AI Resume Analyzer",
    page_icon="📄",
    layout="centered"
)

# App Title & Subtitle
st.title("AI Resume Analyzer")
st.write("Upload a PDF resume, paste a job description, and check your resume match score!")

st.markdown("---")

# Input Section
st.header("1. Upload & Input Data")

uploaded_file = st.file_uploader("Upload your resume (PDF)", type=["pdf"])

target_title = st.text_input("Target Job Title (optional)", placeholder="e.g. Python Developer, Data Analyst")

job_description = st.text_area(
    "Paste Job Description",
    height=200,
    placeholder="Paste the job description or required skills here..."
)

# Optional API Key in Sidebar
st.sidebar.header("Settings")
api_key_input = st.sidebar.text_input(
    "Gemini API Key (Optional)",
    value=os.getenv("GEMINI_API_KEY", ""),
    type="password",
    help="Optional: Enter API key if you want AI-generated recommendations."
)

st.markdown("---")

# Action Button
if st.button("Analyze Resume", type="primary"):
    if not uploaded_file:
        st.error("Please upload a PDF resume before analyzing.")
    elif not job_description.strip():
        st.error("Please paste a job description before analyzing.")
    else:
        with st.spinner("Extracting text from PDF and analyzing skills..."):
            # Step 1: Extract PDF text
            resume_text = extract_text_from_pdf(uploaded_file)

            if not resume_text:
                st.error("Could not extract text from the uploaded PDF. Please make sure it contains selectable text.")
            else:
                # Step 2: Clean text with spaCy (basic NLP preprocessing)
                cleaned_resume_text = clean_text_with_spacy(resume_text)

                # Step 3: Perform skill analysis
                results = analyze_resume(resume_text, job_description, target_title)

                st.markdown("---")
                st.header("2. Analysis Results")

                # Display Match Score
                score = results["score"]
                st.subheader(f"Resume Match Score: {score}%")
                st.progress(score / 100)

                if score >= 75:
                    st.success("Great job! Your resume aligns well with this job description.")
                elif score >= 50:
                    st.warning("Good match, but there are some important missing skills.")
                else:
                    st.error("Low match score. Consider adding key skills required by the job.")

                # Display Skills Comparison
                col1, col2 = st.columns(2)

                with col1:
                    st.subheader("Matched Skills")
                    if results["matched_skills"]:
                        for skill in results["matched_skills"]:
                            st.write(f"✅ {skill}")
                    else:
                        st.write("None detected.")

                with col2:
                    st.subheader("Missing Skills")
                    if results["missing_skills"]:
                        for skill in results["missing_skills"]:
                            st.write(f"❌ {skill}")
                    else:
                        st.write("No missing skills identified!")

                # Display Extracted Skills Summary
                st.markdown("---")
                st.subheader("Extracted Skills Overview")
                st.write(f"**Resume Skills Detected ({len(results['resume_skills'])}):** " + (", ".join(results["resume_skills"]) if results["resume_skills"] else "None"))
                st.write(f"**Job Skills Required ({len(results['job_skills'])}):** " + (", ".join(results["job_skills"]) if results["job_skills"] else "None"))

                # Display Rule-based Suggestions
                st.markdown("---")
                st.subheader("Improvement Suggestions")
                for idx, suggestion in enumerate(results["suggestions"], 1):
                    st.write(f"**{idx}.** {suggestion}")

                # Optional LLM Advice Button
                if api_key_input:
                    st.markdown("---")
                    st.subheader("AI Advice (Optional Feature)")
                    if st.button("Get AI Suggestions"):
                        with st.spinner("Generating AI suggestions..."):
                            ai_advice = get_optional_llm_suggestions(resume_text, job_description, api_key_input)
                            st.info(ai_advice)

                # Resume Text Preview
                with st.expander("View Extracted Resume Text"):
                    st.text_area("Parsed Text", resume_text, height=200, disabled=True)
