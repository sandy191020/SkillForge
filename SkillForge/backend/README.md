# SkillForge Backend Services

This directory contains all backend services for the SkillForge platform.

## Structure

### FastAPI Backend (`/fastapi`)
Python-based backend handling:
- Resume analysis and parsing
- Career roadmap generation
- Portfolio website generation
- DSA problem generation and code execution
- Coding battle questions
- LinkedIn profile optimization

**Port**: 8000

### Node.js Backend (`/node`)
Node.js/Express backend handling:
- AI interview conversations (Ollama)
- Speech-to-text transcription (Whisper)
- Interview scoring and evaluation
- Real-time WebSocket communication

**Port**: 5000

## Running Both Backends

### FastAPI
```bash
cd fastapi
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Node.js
```bash
cd node
npm install
node server.js
```

## API Documentation

### FastAPI - Swagger UI
Visit `http://localhost:8000/docs` for interactive API documentation

### Node.js Endpoints
- POST `/api/chat` - Chat with AI interviewer
- POST `/api/evaluate` - Evaluate interview performance
- POST `/api/transcribe` - Transcribe audio to text
- WebSocket `/ws` - Real-time communication

## Environment Variables

### FastAPI
No environment variables required by default. Configure AI service URLs in `services/` files if needed.

### Node.js
Create `.env` file:
```env
PORT=5000
OLLAMA_URL=http://localhost:11434
WHISPER_API_URL=http://localhost:9000
```

## Dependencies

### FastAPI
- fastapi
- uvicorn
- pdfplumber
- python-multipart
- requests
- pydantic

### Node.js
- express
- cors
- multer
- ws (WebSocket)
- Custom Ollama client

## Development

Both backends support hot-reload in development:
- FastAPI: `uvicorn main:app --reload`
- Node.js: Use `nodemon server.js`

## Testing

### FastAPI
```bash
pytest tests/
```

### Node.js
```bash
npm test
```

## Deployment

Both backends can be containerized with Docker:

```dockerfile
# FastAPI Dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

```dockerfile
# Node.js Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```
