// API client for SkillForge backend services

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
const NODE_API_URL = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:5000';

// Types
export interface AnalyzeResponse {
  filename: string;
  extracted_text_preview: string;
  analysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    ats_score?: number;
  };
}

export interface RoadmapRequest {
  current_role: string;
  target_role: string;
  skills: string;
}

export interface RoadmapResponse {
  roadmap: {
    phases: Array<{
      title: string;
      duration: string;
      skills: string[];
      resources: string[];
    }>;
  };
}

export interface PortfolioResponse {
  html: string;
  css: string;
  js: string;
}

export interface DSAQuestion {
  title: string;
  description: string;
  difficulty: string;
  examples: string[];
  constraints: string[];
}

export interface DSARunResult {
  output: string;
  error?: string;
  execution_time?: number;
}

export interface GameQuestion {
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
}

export interface LinkedInProfile {
  headline: string;
  summary: string;
  experience: string[];
  skills: string[];
}

// Resume Analyzer API
export async function analyzeResume(file: File, jobDescription: string): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const response = await fetch(`${FASTAPI_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze resume');
  }

  return response.json();
}

// Roadmap Generator API
export async function generateRoadmap(data: RoadmapRequest): Promise<RoadmapResponse> {
  const response = await fetch(`${FASTAPI_URL}/roadmap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate roadmap');
  }

  return response.json();
}

// Portfolio Generator API
export async function generatePortfolio(file?: File, textContent?: string): Promise<PortfolioResponse> {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  if (textContent) {
    formData.append('text_content', textContent);
  }

  const response = await fetch(`${FASTAPI_URL}/generate-portfolio`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to generate portfolio');
  }

  return response.json();
}

// DSA Dojo APIs
export async function generateDSAQuestion(topic: string, difficulty: string): Promise<DSAQuestion> {
  const response = await fetch(`${FASTAPI_URL}/dsa/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, difficulty }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate DSA question');
  }

  return response.json();
}

export async function runCode(language: string, code: string, stdin: string = ''): Promise<DSARunResult> {
  const response = await fetch(`${FASTAPI_URL}/dsa/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language, code, stdin }),
  });

  if (!response.ok) {
    throw new Error('Failed to run code');
  }

  return response.json();
}

export async function askYuvi(code: string, question: string, userQuery: string): Promise<{ response: string }> {
  const response = await fetch(`${FASTAPI_URL}/dsa/yuvi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, question, user_query: userQuery }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Yuvi');
  }

  return response.json();
}

// Game Box API
export async function generateBattleQuestion(topic: string): Promise<GameQuestion> {
  const response = await fetch(`${FASTAPI_URL}/game/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate battle question');
  }

  return response.json();
}

// LinkedIn Optimizer API
export async function generateLinkedInProfile(data: {
  fullName: string;
  targetRole: string;
  currentSummary: string;
  skills: string;
  projects?: any[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  strengths?: string;
  softSkills?: string;
  careerGoal?: string;
  achievements?: string;
  tools?: string;
  languages?: string;
  location?: string;
  tone?: string;
}): Promise<LinkedInProfile> {
  const response = await fetch(`${FASTAPI_URL}/linkedin/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate LinkedIn profile');
  }

  return response.json();
}

// Interview APIs (Node.js backend)
export async function chatWithInterviewer(message: string, role: string): Promise<{ response: string }> {
  const response = await fetch(`${NODE_API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, role }),
  });

  if (!response.ok) {
    throw new Error('Failed to chat with interviewer');
  }

  return response.json();
}

export async function evaluateInterview(messages: any[]): Promise<any> {
  const response = await fetch(`${NODE_API_URL}/api/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate interview');
  }

  return response.json();
}

export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch(`${NODE_API_URL}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  return response.json();
}
