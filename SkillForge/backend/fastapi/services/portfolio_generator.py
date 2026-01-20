import requests
import json

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3.2"

def generate_portfolio(user_data: str, model: str = DEFAULT_MODEL) -> dict:
    """
    Extracts structured portfolio data from user input.
    Returns a dictionary with fields like name, tagline, about, skills, projects, contact.
    """
    
    prompt = f"""
    You are a Data Extraction Specialist.
    Extract the following details from the user's input to populate a portfolio website.
    
    USER INPUT:
    {user_data}
    
    Provide the output in the following JSON format ONLY. 
    If a field is missing, make up a reasonable placeholder based on the context or leave it generic.
    
    {{
        "name": "<Candidate Name>",
        "tagline": "<A catchy professional headline>",
        "about": "<A 2-3 sentence professional bio>",
        "skills": ["<Skill 1>", "<Skill 2>", "<Skill 3>", ...],
        "projects": [
            {{
                "title": "<Project Title>",
                "description": "<Brief project description>",
                "tech_stack": ["<Tech 1>", "<Tech 2>"]
            }},
            ... (max 3 projects)
        ],
        "contact": {{
            "email": "<Email or placeholder>",
            "linkedin": "<LinkedIn or placeholder>",
            "github": "<GitHub or placeholder>"
        }}
    }}
    """
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        
        ai_output = result.get("response", "{}")
        
        if "```json" in ai_output:
            ai_output = ai_output.split("```json")[1].split("```")[0]
        elif "```" in ai_output:
             ai_output = ai_output.split("```")[1].split("```")[0]
             
        return json.loads(ai_output)
        
    except Exception as e:
        print(f"Error querying Ollama: {e}")
        # Return fallback data so the frontend doesn't crash
        return {
            "name": "Professional",
            "tagline": "Building the future with code.",
            "about": "I am a passionate developer. (AI failed to extract details)",
            "skills": ["HTML", "CSS", "JavaScript"],
            "projects": [],
            "contact": {"email": "email@example.com"}
        }
