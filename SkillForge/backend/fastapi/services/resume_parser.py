import pdfplumber

def parse_resume(file_path: str) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    """
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""
    
    return text.strip()
