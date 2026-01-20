import requests
import json

OLLAMA_API_URL = "http://localhost:11434/api/generate"
PISTON_API_URL = "https://emkc.org/api/v2/piston/execute"
DEFAULT_MODEL = "llama3.2"

def generate_dsa_question(topic: str, difficulty: str, model: str = DEFAULT_MODEL) -> dict:
    """
    Generates a DSA question based on topic and difficulty.
    Returns structured JSON: {title, description, examples, starter_code}
    """
    prompt = f"""
    You are a Senior Technical Interviewer.
    Generate a {difficulty} level Data Structures and Algorithms problem for the topic: {topic}.
    
    Provide the output in the following JSON format ONLY:
    {{
        "title": "<Problem Title>",
        "description": "<Clear problem statement>",
        "examples": [
            {{"input": "<Example Input>", "output": "<Example Output>", "explanation": "<Optional>"}}
        ],
        "constraints": ["<Constraint 1>", "<Constraint 2>"],
        "starter_code": "<Starter code function definition in {topic} (or Python if topic is generic)>"
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
        return json.loads(ai_output)
    except Exception as e:
        print(f"Error generating question: {e}")
        return {
            "title": "Error Generating Question",
            "description": "Please try again.",
            "examples": [],
            "constraints": [],
            "starter_code": "# Error"
        }

def execute_code(language: str, code: str, stdin: str = "") -> dict:
    """
    Executes code using the Piston API.
    """
    # Map common names to Piston language versions/names
    lang_map = {
        "python": {"language": "python", "version": "3.10.0"},
        "javascript": {"language": "javascript", "version": "18.15.0"},
        "java": {"language": "java", "version": "15.0.2"},
        "c": {"language": "c", "version": "10.2.0"},
        "cpp": {"language": "c++", "version": "10.2.0"},
        "go": {"language": "go", "version": "1.16.2"},
    }
    
    config = lang_map.get(language.lower(), {"language": language.lower(), "version": "*"})
    
    payload = {
        "language": config["language"],
        "version": config["version"],
        "files": [
            {
                "content": code
            }
        ],
        "stdin": stdin
    }
    
    try:
        response = requests.post(PISTON_API_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"run": {"output": f"Execution Error: {str(e)}"}}

def ask_yuvi(code: str, question: str, user_query: str, model: str = DEFAULT_MODEL) -> str:
    """
    Yuvi the AI Tutor provides hints or explanations.
    """
    prompt = f"""
    You are 'Yuvi', a friendly and encouraging AI Coding Tutor.
    The user is solving this problem:
    {question}
    
    Here is their current code:
    {code}
    
    User Question: "{user_query}"
    
    Provide a helpful, concise hint or explanation. 
    DO NOT give the full solution unless explicitly asked. 
    Be encouraging!
    """
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        return response.json().get("response", "Yuvi is thinking...")
    except Exception as e:
        return f"Yuvi is having trouble connecting: {str(e)}"
