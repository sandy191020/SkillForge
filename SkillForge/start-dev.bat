@echo off
echo Starting SkillForge Development Environment...
echo.

REM Start FastAPI Backend
echo [1/3] Starting FastAPI Backend (Port 8000)...
start "FastAPI Backend" cmd /k "cd backend\fastapi && python main.py"
timeout /t 3 /nobreak > nul

REM Start Node.js Backend
echo [2/3] Starting Node.js Backend (Port 5000)...
start "Node.js Backend" cmd /k "cd backend\node && node server.js"
timeout /t 3 /nobreak > nul

REM Start Frontend
echo [3/3] Starting Next.js Frontend (Port 3000)...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo SkillForge is starting up!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo FastAPI:   http://localhost:8000/docs
echo Node.js:   http://localhost:5000
echo.
echo Press any key to stop all services...
pause > nul

REM Kill all services
taskkill /FI "WindowTitle eq FastAPI Backend*" /T /F
taskkill /FI "WindowTitle eq Node.js Backend*" /T /F
taskkill /FI "WindowTitle eq Next.js Frontend*" /T /F

echo All services stopped.
