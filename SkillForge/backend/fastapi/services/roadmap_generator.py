import requests
import json

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3.2"

def generate_roadmap(current_role: str, target_role: str, skills: str, model: str = DEFAULT_MODEL) -> dict:
    """
    Generates a career roadmap from current_role to target_role using a local LLM via Ollama.
    Returns a dictionary with a list of steps.
    """
    
    prompt = f"""
    You are an expert Career Coach and Mentor.
    Create a detailed, step-by-step career roadmap for a user wanting to go from {current_role} to {target_role}.
    The user currently has these skills: {skills}.
    
    Provide the output in the following JSON format ONLY. Do not include any other text or markdown formatting outside the JSON.
    {{
        "roadmap": [
            {{
                "step_number": 1,
                "title": "<Step Title>",
                "description": "<Detailed description of what to learn or do>",
                "resources": ["<Resource 1>", "<Resource 2>"],
                "estimated_time": "<e.g. 2 weeks>"
            }},
            ...
        ]
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
        return {
            "roadmap": [
                {
                    "step_number": 1,
                    "title": "Error",
                    "description": f"Failed to generate roadmap. Ensure Ollama is running. Error: {str(e)}",
                    "resources": [],
                    "estimated_time": "0 weeks"
                }
            ]
        }
