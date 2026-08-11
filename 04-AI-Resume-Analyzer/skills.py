"""
skills.py
---------
Contains predefined database of common skills and helper functions
for extracting skills from text.
"""

import re

# Comprehensive list of common technical and soft skills for resume matching
SKILLS_DB = [
    # Programming Languages
    "Python", "Java", "C++", "C#", "C", "Go", "Rust", "JavaScript", "TypeScript", "PHP", "Ruby", "Swift", "Kotlin",
    # Web Development & Frameworks
    "HTML", "CSS", "React", "Node.js", "Express", "Flask", "Django", "Streamlit", "Angular", "Vue.js", "REST API",
    # Databases & Cloud
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
    # Data Science & Machine Learning
    "Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy", "Scikit-learn", "TensorFlow",
    "PyTorch", "NLP", "spaCy", "NLTK", "OpenCV", "Statistics",
    # Tools & Methodologies
    "Git", "GitHub", "GitLab", "Linux", "JIRA", "Agile", "Scrum", "CI/CD", "Excel", "Power BI", "Tableau",
    # Soft Skills
    "Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management"
]


def extract_skills(text: str) -> list[str]:
    """
    Extracts skills present in the text based on the SKILLS_DB list.
    Matching is case-insensitive.
    """
    if not text:
        return []

    found_skills = set()
    text_lower = text.lower()

    for skill in SKILLS_DB:
        skill_pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        # Special handling for C++, C#, Node.js, .NET where word boundaries \b behave strictly with special chars
        if "+" in skill or "#" in skill or "." in skill:
            skill_pattern = re.escape(skill.lower())

        if re.search(skill_pattern, text_lower):
            found_skills.add(skill)

    return sorted(list(found_skills))
