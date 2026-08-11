"""
resume_parser.py
----------------
Extracts text from PDF files using pypdf and cleans/preprocesses text
using spaCy for basic NLP tokenization and text cleaning.
"""

import io
from pypdf import PdfReader

# Try loading spaCy model, fallback gracefully if not installed
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        nlp = None
except ImportError:
    nlp = None


def extract_text_from_pdf(pdf_file) -> str:
    """
    Extracts plain text from an uploaded PDF file or file path using pypdf.
    Handles corrupt or unreadable files gracefully.
    """
    if pdf_file is None:
        return ""

    try:
        # If passed a Streamlit UploadedFile (BytesIO) or file path
        if isinstance(pdf_file, (bytes, bytearray)):
            pdf_reader = PdfReader(io.BytesIO(pdf_file))
        elif hasattr(pdf_file, "read"):
            pdf_reader = PdfReader(pdf_file)
        else:
            pdf_reader = PdfReader(str(pdf_file))

        extracted_text = []
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text.append(page_text)

        full_text = "\n".join(extracted_text)
        return full_text.strip()

    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""


def clean_text_with_spacy(text: str) -> str:
    """
    Uses spaCy NLP to clean text by removing stop words and punctuation.
    If spaCy is unavailable, falls back to basic Python string cleaning.
    """
    if not text:
        return ""

    if nlp is not None:
        try:
            doc = nlp(text)
            tokens = [
                token.lemma_.lower()
                for token in doc
                if not token.is_stop and not token.is_punct and not token.is_space
            ]
            return " ".join(tokens)
        except Exception:
            pass

    # Fallback to basic string processing
    words = text.lower().split()
    return " ".join(words)
