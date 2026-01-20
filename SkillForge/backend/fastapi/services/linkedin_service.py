import requests
import json

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3.2"

def generate_linkedin_profile(data: dict, model: str = DEFAULT_MODEL) -> dict:
    """
    Generates a professional LinkedIn profile based on user input.
    Returns structured JSON with sections: Headline, About, Experience, etc.
    """
    prompt = f"""
    You are a Professional Career Coach and LinkedIn Expert.
    Create a high-impact LinkedIn profile based on the following user details:

    FULL NAME: {data.get('fullName')}
    TARGET ROLE: {data.get('targetRole')}
    SUMMARY OF EXPERIENCE: {data.get('currentSummary')}
    SKILLS: {data.get('skills')}
    PROJECTS: {json.dumps(data.get('projects', []))}
    EXPERIENCE HISTORY: {json.dumps(data.get('experience', []))}
    EDUCATION: {json.dumps(data.get('education', []))}
    CERTIFICATIONS: {json.dumps(data.get('certifications', []))}
    STRENGTHS: {data.get('strengths')}
    SOFT SKILLS: {data.get('softSkills')}
    CAREER GOAL: {data.get('careerGoal')}
    ACHIEVEMENTS: {data.get('achievements')}
    TOOLS: {data.get('tools')}
    LANGUAGES: {data.get('languages')}
    LOCATION: {data.get('location')}
    TONE: {data.get('tone', 'Professional')}

    Generate the output in the following JSON format ONLY:
    {{
        "headline": "<Catchy, keyword-rich headline>",
        "about": "<Compelling 'About' section (3-4 paragraphs) using the specified tone>",
        "experience_descriptions": [
            {{
                "company": "<Company Name>",
                "role": "<Role>",
                "description": "<Bullet points of responsibilities and achievements (STAR method)>"
            }}
        ],
        "projects_section": "<Formatted text for the Projects section>",
        "skills_section": "<Formatted list of Top Skills>",
        "recommendation_draft": "<A draft recommendation text that they could ask a colleague to write>"
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
        print(f"Error generating LinkedIn profile: {e}")
        return {
            "headline": "Error Generating Profile",
            "about": "Please try again.",
            "experience_descriptions": [],
            "projects_section": "",
            "skills_section": "",
            "recommendation_draft": ""
        }
