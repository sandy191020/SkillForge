# 🚀 SkillForge - AI-Powered Career Platform

<div align="center">

<img width="1878" height="894" alt="image" src="https://github.com/user-attachments/assets/55bc5c14-774c-44c0-859a-a34964711c5e" />
<img width="1631" height="810" alt="image" src="https://github.com/user-attachments/assets/8cce337d-b984-44ee-8eeb-c27b02e50013" />



**Master Your Career Journey with AI**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## 📋 Overview

SkillForge is a comprehensive AI-powered platform that combines multiple career development tools into one unified experience. From resume analysis to interview preparation, DSA practice to portfolio building - everything you need to land your dream job.

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **AI Resume Analyzer** | Upload your resume and get instant AI-powered feedback, ATS optimization tips, and improvement suggestions |
| **Career Roadmap** | Generate personalized learning paths based on your current skills and target role |
| **Portfolio Generator** | Auto-generate beautiful portfolio websites from your resume and projects |
| **DSA Dojo** | Practice data structures and algorithms with AI mentor Yuvi providing hints and guidance |
| **Game Box** | Compete in coding challenges and battle other developers in real-time |
| **AI Interview Coach** | Practice interviews with AI, get real-time feedback, and improve your performance |
| **LinkedIn Optimizer** | Generate compelling LinkedIn profiles optimized for your target role |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                    Port: 3000                                │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ Resume   │ Roadmap  │ DSA Dojo │ Interview│ LinkedIn │  │
│  │ Analyzer │ Generator│          │  Coach   │ Optimizer│  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
┌───────────────▼──────────┐  ┌────────▼──────────────┐
│  FastAPI Backend         │  │  Node.js Backend      │
│  Port: 8000              │  │  Port: 5000           │
│  ┌────────────────────┐  │  │  ┌─────────────────┐  │
│  │ Resume Parser      │  │  │  │ Ollama AI       │  │
│  │ AI Analyzer        │  │  │  │ Whisper STT     │  │
│  │ Roadmap Generator  │  │  │  │ Interview Logic │  │
│  │ Portfolio Builder  │  │  │  │ WebSocket       │  │
│  │ DSA Service        │  │  │  └─────────────────┘  │
│  │ Game Service       │  │  │                       │
│  │ LinkedIn Service   │  │  │                       │
│  └────────────────────┘  │  │                       │
└──────────────────────────┘  └───────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Ollama** (for AI features) - [Install Ollama](https://ollama.ai)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/skillforge.git
cd skillforge
```

2. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

3. **Setup FastAPI Backend**
```bash
cd backend/fastapi
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

4. **Setup Node.js Backend**
```bash
cd backend/node
npm install
node server.js
```

### Access the Application

- **Frontend**: http://localhost:3000
- **FastAPI Docs**: http://localhost:8000/docs
- **Node.js API**: http://localhost:5000

## 📁 Project Structure

```
SkillForge/
├── backend/
│   ├── fastapi/          # Python FastAPI backend
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── services/
│   └── node/             # Node.js Express backend
│       ├── server.js
│       └── package.json
│
├── frontend/             # Next.js frontend
│   ├── app/
│   │   ├── page.tsx      # Landing page
│   │   ├── resume/       # Resume analyzer
│   │   ├── roadmap/      # Career roadmap
│   │   ├── dsa-dojo/     # DSA practice
│   │   ├── interview/    # Interview coach
│   │   └── ...
│   ├── components/
│   │   ├── ui/           # UI components
│   │   └── landing/      # Landing sections
│   └── package.json
│
├── PROJECT_GUIDE.md      # Detailed documentation
└── README.md             # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Theme**: next-themes (Dark/Light mode)

### Backend
- **FastAPI**: Python web framework for ML/AI services
- **Express.js**: Node.js framework for real-time features
- **Ollama**: Local AI model integration
- **Whisper**: Speech-to-text transcription
- **pdfplumber**: PDF parsing

## 📚 Documentation

- [Project Guide](PROJECT_GUIDE.md) - Comprehensive project documentation
- [Backend README](backend/README.md) - Backend services documentation
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when running)



## 🧪 Development

### Running in Development Mode

Open 3 terminals:

```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - FastAPI
cd backend/fastapi && python main.py

# Terminal 3 - Node.js
cd backend/node && node server.js
```

### Building for Production

```bash
cd frontend
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Ollama](https://ollama.ai/) - Local AI models
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework



## 🗺️ Roadmap

- [ ] User authentication and profiles
- [ ] Progress tracking and analytics
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Integration with job boards
- [ ] Advanced AI models
- [ ] Multi-language support

---

<div align="center">

**Built with ❤️ by the SkillForge Team**

• [Report Bug](https://github.com/yourusername/skillforge/issues) • [Request Feature](https://github.com/yourusername/skillforge/issues)

</div>
