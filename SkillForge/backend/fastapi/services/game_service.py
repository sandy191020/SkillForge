import requests
import json
import random

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3.2"

def generate_battle_question(topic: str, model: str = DEFAULT_MODEL) -> dict:
    """
    Generates a multiple-choice battle question.
    Returns: { question, options: [A,B,C,D], correct_index, difficulty }
    """
    prompt = f"""
    You are a Game Master for a trivia battle game.
    Generate a challenging multiple-choice question about: {topic}.
    
    Provide the output in the following JSON format ONLY:
    {{
        "question": "<The Question Text>",
        "options": ["<Option A>", "<Option B>", "<Option C>", "<Option D>"],
        "correct_index": <0-3 integer indicating the correct option>,
        "difficulty": "<Easy/Medium/Hard>"
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
        print(f"Error generating battle question: {e}")
        # Fallback question to prevent crash
        return {
            "question": f"Which of these is related to {topic}?",
            "options": ["Knowledge", "Power", "Wisdom", "All of the above"],
            "correct_index": 3,
            "difficulty": "Easy"
        }
