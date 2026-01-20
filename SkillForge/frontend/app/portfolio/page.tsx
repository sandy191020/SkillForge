'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- THEMES CONFIGURATION ---
const THEMES = {
    default: {
        name: 'Midnight',
        colors: {
            '--bg': '#0a0a0a',
            '--surface': '#171717',
            '--surface-2': '#262626',
            '--primary': '#8b5cf6',
            '--secondary': '#ec4899',
            '--text': '#ffffff',
            '--text-muted': '#a3a3a3',
        }
    },
    ocean: {
        name: 'Deep Ocean',
        colors: {
            '--bg': '#0f172a',
            '--surface': '#1e293b',
            '--surface-2': '#334155',
            '--primary': '#38bdf8',
            '--secondary': '#818cf8',
            '--text': '#f8fafc',
            '--text-muted': '#94a3b8',
        }
    },
    forest: {
        name: 'Neon Forest',
        colors: {
            '--bg': '#022c22',
            '--surface': '#064e3b',
            '--surface-2': '#065f46',
            '--primary': '#34d399',
            '--secondary': '#a7f3d0',
            '--text': '#ecfdf5',
            '--text-muted': '#6ee7b7',
        }
    },
    sunset: {
        name: 'Sunset',
        colors: {
            '--bg': '#450a0a',
            '--surface': '#7f1d1d',
            '--surface-2': '#991b1b',
            '--primary': '#fbbf24',
            '--secondary': '#f87171',
            '--text': '#fffbeb',
            '--text-muted': '#fca5a5',
        }
    },
    light: {
        name: 'Clean Light',
        colors: {
            '--bg': '#ffffff',
            '--surface': '#f3f4f6',
            '--surface-2': '#e5e7eb',
            '--primary': '#2563eb',
            '--secondary': '#4f46e5',
            '--text': '#111827',
            '--text-muted': '#6b7280',
        }
    }
};

// --- TEMPLATE GENERATOR ---
const generateTemplateCode = (data: any, themeKey: string = 'default') => {
    const theme = THEMES[themeKey as keyof typeof THEMES] || THEMES.default;

    // Convert theme colors object to CSS variables string
    const cssVariables = Object.entries(theme.colors)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n    ');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="cursor-dot"></div>
    <div class="cursor-outline"></div>

    <nav>
        <div class="logo">${data.name.split(' ')[0]}<span class="dot">.</span></div>
        <div class="links">
            <a href="#about" class="nav-link">About</a>
            <a href="#skills" class="nav-link">Skills</a>
            <a href="#projects" class="nav-link">Projects</a>
            <a href="#contact" class="nav-btn">Let's Talk</a>
        </div>
    </nav>

    <header>
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="hero-content">
            <div class="badge">Available for work</div>
            <h1>Creating <span class="gradient-text">Digital Experiences</span><br>That Matter.</h1>
            <p class="tagline">Hi, I'm <strong>${data.name}</strong>. ${data.tagline}</p>
            <div class="hero-btns">
                <a href="#projects" class="btn primary">View Work</a>
                <a href="#contact" class="btn secondary">Contact Me</a>
            </div>
        </div>
    </header>

    <section id="about">
        <div class="container">
            <div class="section-header">
                <span class="subtitle">Who I Am</span>
                <h2>About Me</h2>
            </div>
            <div class="about-card">
                <p>${data.about}</p>
                <div class="stats">
                    <div class="stat">
                        <span class="number">3+</span>
                        <span class="label">Years Exp.</span>
                    </div>
                    <div class="stat">
                        <span class="number">10+</span>
                        <span class="label">Projects</span>
                    </div>
                    <div class="stat">
                        <span class="number">100%</span>
                        <span class="label">Commitment</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills">
        <div class="container">
            <div class="section-header">
                <span class="subtitle">My Arsenal</span>
                <h2>Skills & Tech</h2>
            </div>
            <div class="skills-wrapper">
                ${data.skills.map((skill: string) => `
                <div class="skill-pill">
                    <i class="fas fa-code"></i>
                    <span>${skill}</span>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section id="projects">
        <div class="container">
            <div class="section-header">
                <span class="subtitle">Selected Works</span>
                <h2>Featured Projects</h2>
            </div>
            <div class="projects-grid">
                ${data.projects.map((project: any, index: number) => `
                <div class="project-card" style="animation-delay: ${index * 100}ms">
                    <div class="card-content">
                        <div class="project-icon"><i class="fas fa-layer-group"></i></div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="tech-stack">
                            ${project.tech_stack.map((tech: string) => `<span>${tech}</span>`).join('')}
                        </div>
                        <a href="#" class="project-link">View Case Study <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="contact">
        <div class="container">
            <div class="contact-box">
                <h2>Ready to start a project?</h2>
                <p>Let's build something amazing together.</p>
                <div class="contact-links">
                    ${data.contact.email ? `<a href="mailto:${data.contact.email}" class="contact-item"><i class="fas fa-envelope"></i> ${data.contact.email}</a>` : ''}
                    ${data.contact.linkedin ? `<a href="${data.contact.linkedin}" target="_blank" class="contact-item"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                    ${data.contact.github ? `<a href="${data.contact.github}" target="_blank" class="contact-item"><i class="fab fa-github"></i> GitHub</a>` : ''}
                </div>
            </div>
        </div>
    </section>

    <footer>
        <p>Designed & Built by <strong>${data.name}</strong></p>
        <p class="copyright">&copy; ${new Date().getFullYear()} All rights reserved.</p>
    </footer>
</body>
</html>
  `;

    const css = `
:root {
    ${cssVariables}
    --font-main: 'Outfit', sans-serif;
    --font-display: 'Space Grotesk', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; cursor: none; }

body {
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-main);
    overflow-x: hidden;
    line-height: 1.6;
}

/* Custom Cursor */
.cursor-dot, .cursor-outline {
    position: fixed; top: 0; left: 0; transform: translate(-50%, -50%);
    border-radius: 50%; z-index: 9999; pointer-events: none;
}
.cursor-dot { width: 8px; height: 8px; background-color: var(--primary); }
.cursor-outline {
    width: 40px; height: 40px; border: 1px solid rgba(255, 255, 255, 0.5);
    transition: width 0.2s, height 0.2s, background-color 0.2s;
}

/* Typography & Utilities */
h1, h2, h3 { font-family: var(--font-display); font-weight: 700; line-height: 1.1; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.gradient-text {
    background: linear-gradient(to right, var(--primary), var(--secondary));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.btn {
    display: inline-block; padding: 1rem 2rem; border-radius: 50px;
    font-weight: 600; text-decoration: none; transition: all 0.3s ease;
    font-family: var(--font-display); letter-spacing: 0.5px;
}
.btn.primary {
    background: white; color: black;
}
.btn.primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }
.btn.secondary {
    background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); margin-left: 1rem;
}
.btn.secondary:hover { border-color: white; background: rgba(255,255,255,0.05); }

/* Nav */
nav {
    display: flex; justify-content: space-between; align-items: center;
    padding: 2rem 3rem; position: fixed; width: 100%; top: 0; z-index: 100;
    backdrop-filter: blur(10px); background: rgba(10,10,10,0.5);
}
.logo { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--text); }
.logo .dot { color: var(--primary); }
.links { display: flex; align-items: center; gap: 2rem; }
.nav-link { color: var(--text-muted); text-decoration: none; font-weight: 500; transition: 0.3s; }
.nav-link:hover { color: var(--text); }
.nav-btn {
    padding: 0.6rem 1.5rem; background: var(--surface-2); color: white;
    border-radius: 30px; text-decoration: none; font-size: 0.9rem; transition: 0.3s;
}
.nav-btn:hover { background: var(--primary); }

/* Header */
header {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; text-align: center; padding-top: 4rem;
}
.blob {
    position: absolute; filter: blur(80px); opacity: 0.4; z-index: -1;
    animation: float 10s infinite ease-in-out;
}
.blob-1 { top: 10%; left: 10%; width: 400px; height: 400px; background: var(--primary); }
.blob-2 { bottom: 10%; right: 10%; width: 300px; height: 300px; background: var(--secondary); animation-delay: 5s; }

.badge {
    display: inline-block; padding: 0.5rem 1rem; border-radius: 20px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.8rem; color: var(--primary); margin-bottom: 1.5rem;
}
h1 { font-size: 5rem; margin-bottom: 1.5rem; letter-spacing: -2px; }
.tagline { font-size: 1.2rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 2.5rem; }

/* Sections */
section { padding: 8rem 0; }
.section-header { text-align: center; margin-bottom: 4rem; }
.subtitle { color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; display: block; margin-bottom: 1rem; }
h2 { font-size: 3rem; }

/* About */
.about-card {
    background: var(--surface); border: 1px solid rgba(255,255,255,0.05);
    padding: 3rem; border-radius: 20px; text-align: center; max-width: 800px; margin: 0 auto;
}
.stats {
    display: flex; justify-content: center; gap: 4rem; margin-top: 3rem;
    padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05);
}
.stat { display: flex; flex-direction: column; }
.stat .number { font-size: 2.5rem; font-weight: 700; color: var(--text); font-family: var(--font-display); }
.stat .label { color: var(--text-muted); font-size: 0.9rem; }

/* Skills */
.skills-wrapper { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; max-width: 900px; margin: 0 auto; }
.skill-pill {
    background: var(--surface); padding: 0.8rem 1.5rem; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 0.8rem;
    transition: 0.3s; color: var(--text);
}
.skill-pill:hover { border-color: var(--primary); transform: translateY(-2px); background: rgba(139, 92, 246, 0.1); }
.skill-pill i { color: var(--primary); }

/* Projects */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
.project-card {
    background: var(--surface); border-radius: 20px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.05); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative; group;
}
.project-card:hover { transform: translateY(-10px); border-color: rgba(255,255,255,0.2); }
.card-content { padding: 2.5rem; }
.project-icon {
    width: 50px; height: 50px; background: rgba(255,255,255,0.05);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; color: var(--secondary); font-size: 1.2rem;
}
.project-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text); }
.project-card p { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.95rem; }
.tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
.tech-stack span {
    font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.3rem 0.8rem;
    border-radius: 20px; color: var(--text-muted);
}
.project-link {
    color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.9rem;
    display: flex; align-items: center; gap: 0.5rem; transition: 0.3s;
}
.project-link:hover { gap: 1rem; color: var(--primary); }

/* Contact */
.contact-box {
    background: linear-gradient(145deg, var(--surface), var(--bg));
    border: 1px solid rgba(255,255,255,0.05); padding: 4rem; border-radius: 30px;
    text-align: center;
}
.contact-links { display: flex; justify-content: center; gap: 2rem; margin-top: 2rem; flex-wrap: wrap; }
.contact-item {
    display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.05);
    padding: 1rem 2rem; border-radius: 15px; color: white; text-decoration: none;
    transition: 0.3s; border: 1px solid transparent;
}
.contact-item:hover { background: rgba(255,255,255,0.1); border-color: var(--primary); }

footer {
    padding: 3rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);
    color: var(--text-muted); font-size: 0.9rem;
}

@keyframes float {
    0% { transform: translate(0, 0); }
    50% { transform: translate(20px, 40px); }
    100% { transform: translate(0, 0); }
}

@media (max-width: 768px) {
    h1 { font-size: 3rem; }
    .links { display: none; }
    .stats { gap: 2rem; }
    .contact-links { flex-direction: column; }
}
  `;

    const js = `
// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = \`\${posX}px\`;
    cursorDot.style.top = \`\${posY}px\`;

    cursorOutline.animate({
        left: \`\${posX}px\`,
        top: \`\${posY}px\`
    }, { duration: 500, fill: "forwards" });
});

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});

// Add visible class logic
const style = document.createElement('style');
style.innerHTML = \`
    .visible { opacity: 1 !important; transform: translateY(0) !important; }
\`;
document.head.appendChild(style);
  `;

    return { html, css, js };
};

export default function PortfolioMakerPage() {
    const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
    const [textContent, setTextContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null); // Store raw data for theme switching
    const [generatedCode, setGeneratedCode] = useState<{ html: string; css: string; js: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
    const [previewKey, setPreviewKey] = useState(0);
    const [currentTheme, setCurrentTheme] = useState('default');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleThemeChange = (themeKey: string) => {
        setCurrentTheme(themeKey);
        if (generatedData) {
            const code = generateTemplateCode(generatedData, themeKey);
            setGeneratedCode(code);
            setPreviewKey(prev => prev + 1);
        }
    };

    const handleDownload = () => {
        if (!generatedCode) return;
        const combinedCode = `
      ${generatedCode.html}
      <style>${generatedCode.css}</style>
      <script>${generatedCode.js}</script>
    `;
        const blob = new Blob([combinedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeneratedCode(null);

        const formData = new FormData();
        if (inputMode === 'text') {
            formData.append('text_content', textContent);
        } else if (file) {
            formData.append('file', file);
        }

        try {
            // 1. Get structured data from AI (Fast)
            const response = await fetch('http://localhost:8000/generate-portfolio', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate portfolio data');
            }

            const data = await response.json();
            setGeneratedData(data); // Save data

            // 2. Generate Code locally using Template (Instant)
            const code = generateTemplateCode(data, currentTheme);
            setGeneratedCode(code);
            setPreviewKey(prev => prev + 1);

        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to generate portfolio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCombinedCode = () => {
        if (!generatedCode) return '';
        return `
      ${generatedCode.html}
      <style>${generatedCode.css}</style>
      <script>${generatedCode.js}</script>
    `;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-800 p-4 flex justify-between items-center bg-gray-900/90 backdrop-blur z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
                        AI Portfolio Architect <span className="text-xs text-gray-500 ml-2 border border-gray-700 px-2 py-0.5 rounded">Premium Edition 💎</span>
                    </h1>
                </div>

                <div className="flex gap-4 items-center">
                    {generatedCode && (
                        <button
                            onClick={handleDownload}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Code
                        </button>
                    )}
                    <button
                        onClick={() => window.location.href = '/'}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        Exit to Home
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Input & Controls */}
                <div className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col p-4 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Input Source</h2>
                        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
                            <button
                                onClick={() => setInputMode('text')}
                                className={`flex-1 py-2 text-sm rounded-md transition ${inputMode === 'text' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setInputMode('file')}
                                className={`flex-1 py-2 text-sm rounded-md transition ${inputMode === 'file' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Resume Upload
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {inputMode === 'text' ? (
                                <textarea
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    placeholder="Describe yourself, your skills, and what you want in your portfolio..."
                                    className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-green-500 resize-none"
                                    required
                                />
                            ) : (
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.docx"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="text-gray-400">
                                        {file ? (
                                            <span className="text-green-400 font-medium">{file.name}</span>
                                        ) : (
                                            <>
                                                <p className="mb-2">Drop resume here</p>
                                                <p className="text-xs text-gray-500">PDF or DOCX</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold shadow-lg transform transition-all duration-200 
                  ${loading
                                        ? 'bg-gray-700 cursor-not-allowed opacity-75'
                                        : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 hover:scale-[1.02]'
                                    }`}
                            >
                                {loading ? 'Designing...' : 'Generate Premium Portfolio ✨'}
                            </button>
                        </form>
                    </div>

                    {/* Theme Selector */}
                    {generatedData && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Color Theme</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(THEMES).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleThemeChange(key)}
                                        className={`p-2 rounded-md text-xs font-medium transition border flex items-center gap-2
                                  ${currentTheme === key
                                                ? 'bg-gray-800 border-green-500 text-white'
                                                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ background: theme.colors['--primary'] }}
                                        ></div>
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content - Split View */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* IDE / Code View */}
                    <div className="flex-1 flex flex-col border-r border-gray-800 bg-[#1e1e1e]">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-800 bg-[#252526]">
                            {['html', 'css', 'js'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveTab(lang as any)}
                                    className={`px-6 py-2 text-sm font-medium border-r border-gray-800 transition-colors
                    ${activeTab === lang
                                            ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-400'
                                            : 'text-gray-500 hover:bg-[#2a2d2e] hover:text-gray-300'
                                        }`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 relative overflow-hidden">
                            {generatedCode ? (
                                <textarea
                                    value={generatedCode[activeTab]}
                                    onChange={(e) => {
                                        setGeneratedCode({
                                            ...generatedCode,
                                            [activeTab]: e.target.value
                                        });
                                    }}
                                    className="w-full h-full bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
                                    spellCheck={false}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                    <p>Code will appear here...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview View */}
                    <div className="flex-1 flex flex-col bg-white relative">
                        <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 text-center shadow-sm mx-4">
                                    localhost:3000/preview
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewKey(prev => prev + 1)}
                                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                            >
                                Refresh Preview
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            {generatedCode ? (
                                <iframe
                                    key={previewKey}
                                    srcDoc={getCombinedCode()}
                                    className="w-full h-full border-none"
                                    title="Portfolio Preview"
                                    sandbox="allow-scripts"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        <p>Live Preview</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
