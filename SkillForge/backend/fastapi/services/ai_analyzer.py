import requests
import json

OLLAMA_API_URL = "http://localhost:11434/api/generate"
# You can change this to "llama3", "mistral", etc.
DEFAULT_MODEL = "llama3.2" 

def analyze_resume(resume_text: str, job_description: str, model: str = DEFAULT_MODEL) -> dict:
    """
    Analyzes the resume against the job description using a local LLM via Ollama.
    Returns a dictionary with ATS score, summary, missing keywords, and feedback.
    """
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Resume Analyzer. 
    Analyze the following resume against the provided job description.
    
    RESUME:
    {resume_text}
    
    JOB DESCRIPTION:
    {job_description}
    
    Provide the output in the following JSON format ONLY. Do not include any other text or markdown formatting outside the JSON.
    {{
        "ats_score": <number between 0 and 100>,
        "summary": "<brief summary of the candidate's fit>",
        "missing_keywords": ["<keyword1>", "<keyword2>", ...],
        "feedback": "<detailed feedback on how to improve the resume>"
    }}
    """
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json" # Enforce JSON mode if supported by the model
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Parse the 'response' field from Ollama
        ai_output = result.get("response", "{}")
        
        # clean up potential markdown code blocks if the model adds them
        if "```json" in ai_output:
            ai_output = ai_output.split("```json")[1].split("```")[0]
        elif "```" in ai_output:
             ai_output = ai_output.split("```")[1].split("```")[0]
             
        return json.loads(ai_output)
        
    except Exception as e:
        print(f"Error querying Ollama: {e}")
        # Return a fallback error response
        return {
            "ats_score": 0,
            "summary": "Error analyzing resume.",
            "missing_keywords": [],
            "feedback": f"Failed to connect to AI model. Ensure Ollama is running. Error: {str(e)}"
        }
