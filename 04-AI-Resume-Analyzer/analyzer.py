"""
analyzer.py
-----------
Contains logic for matching resume skills against a job description,
calculating match percentage, generating rule-based improvement suggestions,
and optionally calling an LLM API for advanced suggestions.
"""

import json
import requests
from skills import extract_skills


def analyze_resume(resume_text: str, job_description: str, target_title: str = "") -> dict:
    """
    Compares skills in resume text with job description text.
    Calculates match percentage and returns matched/missing skills with suggestions.
    """
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    # Convert to sets for comparison
    resume_set = set(resume_skills)
    job_set = set(job_skills)

    matched_skills = sorted(list(resume_set.intersection(job_set)))
    missing_skills = sorted(list(job_set.difference(resume_set)))

    # Calculate match percentage
    if len(job_skills) > 0:
        score = round((len(matched_skills) / len(job_skills)) * 100)
    else:
        score = 0

    # Rule-based suggestions
    suggestions = generate_rule_based_suggestions(score, missing_skills, target_title)

    return {
        "score": score,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }


def generate_rule_based_suggestions(score: int, missing_skills: list[str], target_title: str) -> list[str]:
    """
    Generates beginner-friendly improvement suggestions based on score and missing skills.
    """
    suggestions = []

    if target_title:
        suggestions.append(f"Tailor your resume headline specifically for the role: '{target_title}'.")

    if missing_skills:
        top_missing = ", ".join(missing_skills[:5])
        suggestions.append(f"Key missing skills to highlight or learn: {top_missing}.")
        suggestions.append("Add relevant projects or coursework demonstrating experience with these missing technologies.")

    if score < 50:
        suggestions.append("Your resume currently matches less than 50% of required job skills. Try tailoring bullet points to match the job description closely.")
    elif score < 80:
        suggestions.append("Good match! Highlight existing matched skills prominently in your Summary and Skills sections.")
    else:
        suggestions.append("Strong match! Ensure your project descriptions include quantifiable achievements and metrics.")

    suggestions.append("Use standard section headings like 'Technical Skills', 'Projects', and 'Work Experience'.")

    return suggestions


def get_optional_llm_suggestions(resume_text: str, job_description: str, api_key: str = "") -> str:
    """
    Optional LLM suggestion feature. Works only if API key is provided.
    Falls back gracefully if key is missing or request fails.
    """
    if not api_key:
        return "No API key provided. Use the rule-based suggestions above for resume improvement."

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        prompt = f"""
        Act as an experienced tech recruiter. Briefly analyze this resume against the job description.
        Provide 3 concise, bulleted advice points to improve the resume.

        Resume:
        {resume_text[:1500]}

        Job Description:
        {job_description[:1500]}
        """
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }

        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            result = response.json()
            text_result = result['candidates'][0]['content']['parts'][0]['text']
            return text_result
        else:
            return f"API Call returned status {response.status_code}. Unable to fetch AI suggestions."
    except Exception as e:
        return f"Could not fetch AI suggestions: {str(e)}"
