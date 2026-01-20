from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import shutil

from services.resume_parser import parse_resume

from services.ai_analyzer import analyze_resume
from services.roadmap_generator import generate_roadmap
from services.portfolio_generator import generate_portfolio
from services.dsa_service import generate_dsa_question, execute_code, ask_yuvi
from services.game_service import generate_battle_question
from services.linkedin_service import generate_linkedin_profile

app = FastAPI(title="AI Resume Analyzer", version="1.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    job_description: str

class RoadmapRequest(BaseModel):
    current_role: str
    target_role: str
    skills: str

class PortfolioRequest(BaseModel):
    text_content: str

class DSAGenRequest(BaseModel):
    topic: str
    difficulty: str

class DSARunRequest(BaseModel):
    language: str
    code: str
    stdin: str = ""

class DSAYuviRequest(BaseModel):
    code: str
    question: str
    user_query: str

class GameGenRequest(BaseModel):
    topic: str

class LinkedInRequest(BaseModel):
    fullName: str
    targetRole: str
    currentSummary: str
    skills: str
    projects: list = []
    experience: list = []
    education: list = []
    certifications: list = []
    strengths: str = ""
    softSkills: str = ""
    careerGoal: str = ""
    achievements: str = ""
    tools: str = ""
    languages: str = ""
    location: str = ""
    tone: str = "Professional"

@app.get("/")
def read_root():
    return {"message": "AI Resume Analyzer API is running"}

@app.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = "" # In a real multipart form, this might need to be a Form field
):
    # 1. Save temp file
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 2. Parse Resume
        text = parse_resume(temp_filename)
        
        if not text:
             raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 3. Analyze with AI
        # Note: If job_description is empty, we can provide a generic analysis
        analysis = analyze_resume(text, job_description)
        
        return {
            "filename": file.filename,
            "extracted_text_preview": text[:200] + "...",
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.post("/roadmap")
async def create_roadmap(request: RoadmapRequest):
    try:
        roadmap = generate_roadmap(request.current_role, request.target_role, request.skills)
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-portfolio")
async def create_portfolio(
    file: Optional[UploadFile] = File(None),
    text_content: Optional[str] = Form(None)
):
    temp_filename = None
    user_data = ""

    try:
        # 1. Handle File Upload (if present)
        if file:
            temp_filename = f"temp_portfolio_{file.filename}"
            with open(temp_filename, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            parsed_text = parse_resume(temp_filename)
            if parsed_text:
                user_data += f"\nRESUME CONTENT:\n{parsed_text}\n"
        
        # 2. Handle Text Input (if present)
        if text_content:
            user_data += f"\nUSER NOTES:\n{text_content}\n"

        if not user_data.strip():
             raise HTTPException(status_code=400, detail="Please provide a resume or text description.")

        # 3. Generate Portfolio
        portfolio_code = generate_portfolio(user_data)
        return portfolio_code

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_filename and os.path.exists(temp_filename):
            os.remove(temp_filename)

# --- DSA DOJO ENDPOINTS ---

@app.post("/dsa/generate")
async def dsa_generate(request: DSAGenRequest):
    try:
        return generate_dsa_question(request.topic, request.difficulty)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/dsa/run")
async def dsa_run(request: DSARunRequest):
    try:
        return execute_code(request.language, request.code, request.stdin)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/dsa/yuvi")
async def dsa_yuvi(request: DSAYuviRequest):
    try:
        response = ask_yuvi(request.code, request.question, request.user_query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- GAME BOX ENDPOINTS ---

@app.post("/game/generate")
async def game_generate(request: GameGenRequest):
    try:
        return generate_battle_question(request.topic)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- LINKEDIN MAKER ENDPOINTS ---

@app.post("/linkedin/generate")
async def linkedin_generate(request: LinkedInRequest):
    try:
        return generate_linkedin_profile(request.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
