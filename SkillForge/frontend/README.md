# Twin Coach AI

Your AI-Powered Learning and Interview Coach - Practice interviews, generate roadmaps, analyze resumes, and earn certificates.

## Features

- **Interview Assistant**: Practice with AI-generated interview questions tailored to your role
- **Resume Analyzer**: Get instant ATS scores and improvement suggestions
- **Roadmap Maker**: Generate personalized learning roadmaps for your career goals
- **Certificates**: Earn blockchain-verified certificates for your achievements

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
twin-coach-ai/
├── app/
│   ├── dashboard/
│   │   ├── interview/
│   │   │   ├── results/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── resume/
│   │   │   └── page.tsx
│   │   ├── roadmap/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   └── skeleton.tsx
│   ├── sidebar.tsx
│   ├── navbar.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── question-card.tsx
│   ├── upload-box.tsx
│   ├── roadmap-phase.tsx
│   └── certificate-card.tsx
└── lib/
    └── utils.ts
```

## Pages

### Landing Page (`/`)
Modern SaaS landing page with hero section and feature cards

### Authentication (`/login`, `/signup`)
Clean authentication UI with dark/light mode toggle

### Dashboard (`/dashboard`)
Main dashboard with module overview

### Interview Assistant (`/dashboard/interview`)
- Role selection
- AI-generated questions
- Answer submission
- Results page with scores and feedback

### Resume Analyzer (`/dashboard/resume`)
- PDF upload
- ATS score analysis
- Missing skills detection
- Improvement suggestions

### Roadmap Maker (`/dashboard/roadmap`)
- Goal input
- AI-generated learning roadmap
- Collapsible phases with subtasks and resources
- PDF download (placeholder)

### Certificates (`/dashboard/certificates`)
- Certificate grid view
- Blockchain mint status
- Achievement tracking

## Components

### Reusable Components
- `Sidebar`: Navigation sidebar with module links
- `Navbar`: Top navigation with user avatar and theme toggle
- `QuestionCard`: Interview question display with answer input
- `UploadBox`: File upload component for resumes
- `RoadmapPhase`: Collapsible roadmap phase with progress tracking
- `CertificateCard`: Certificate display with mint status

## TODO - Backend Integration

The following features need backend integration:

- [ ] Authentication (Supabase)
- [ ] AI question generation (Ollama)
- [ ] Resume analysis (AI)
- [ ] Roadmap generation (AI)
- [ ] Certificate minting (Blockchain)
- [ ] User data persistence
- [ ] API routes

## License

Open Source
