'use client';

import React, { useState } from 'react';

// --- TYPES ---
interface FormData {
    fullName: string;
    targetRole: string;
    currentSummary: string;
    skills: string;
    projects: { title: string; description: string }[];
    experience: { company: string; role: string; duration: string; description: string }[];
    education: { degree: string; school: string; year: string }[];
    certifications: { name: string; issuer: string; year: string }[];
    strengths: string;
    softSkills: string;
    careerGoal: string;
    achievements: string;
    tools: string;
    languages: string;
    location: string;
    tone: string;
}

interface GeneratedProfile {
    headline: string;
    about: string;
    experience_descriptions: { company: string; role: string; description: string }[];
    projects_section: string;
    skills_section: string;
    recommendation_draft: string;
}

export default function LinkedInMakerPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [generatedProfile, setGeneratedProfile] = useState<GeneratedProfile | null>(null);

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        targetRole: '',
        currentSummary: '',
        skills: '',
        projects: [{ title: '', description: '' }],
        experience: [{ company: '', role: '', duration: '', description: '' }],
        education: [{ degree: '', school: '', year: '' }],
        certifications: [{ name: '', issuer: '', year: '' }],
        strengths: '',
        softSkills: '',
        careerGoal: '',
        achievements: '',
        tools: '',
        languages: '',
        location: '',
        tone: 'Professional'
    });

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleArrayChange = (field: 'projects' | 'experience' | 'education' | 'certifications', index: number, subField: string, value: string) => {
        const newArray = [...formData[field]];
        (newArray[index] as any)[subField] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'projects' | 'experience' | 'education' | 'certifications') => {
        const emptyItem = field === 'projects' ? { title: '', description: '' } :
            field === 'experience' ? { company: '', role: '', duration: '', description: '' } :
                field === 'education' ? { degree: '', school: '', year: '' } :
                    { name: '', issuer: '', year: '' };
        setFormData({ ...formData, [field]: [...formData[field], emptyItem] });
    };

    const generateProfile = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/linkedin/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setGeneratedProfile(data);
            setStep(4); // Move to Result View
        } catch (error) {
            alert('Failed to generate profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    // --- RENDER STEPS ---

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                        LinkedIn Profile Architect
                    </h1>
                    <p className="text-gray-400">Build a personal brand that stands out.</p>
                </header>

                {/* Progress Bar */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10"></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'
                            }`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* STEP 1: ESSENTIALS */}
                {step === 1 && (
                    <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-blue-400">Step 1: The Essentials</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm text-gray-400 mb-1">Target Role</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.targetRole} onChange={(e) => handleInputChange('targetRole', e.target.value)} placeholder="e.g. Data Scientist" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Summary of Experience</label>
                                <textarea className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none h-24"
                                    value={formData.currentSummary} onChange={(e) => handleInputChange('currentSummary', e.target.value)} placeholder="Briefly describe what you do now..." />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Skills (Technical & Soft)</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.skills} onChange={(e) => handleInputChange('skills', e.target.value)} placeholder="Python, React, Leadership..." />
                            </div>

                            {/* Projects */}
                            <div className="col-span-2">
                                <label className="block text-sm text-gray-400 mb-2">Key Projects</label>
                                {formData.projects.map((proj, i) => (
                                    <div key={i} className="mb-4 p-4 bg-gray-900 rounded border border-gray-700">
                                        <input type="text" placeholder="Project Title" className="w-full bg-transparent border-b border-gray-700 mb-2 p-1 outline-none"
                                            value={proj.title} onChange={(e) => handleArrayChange('projects', i, 'title', e.target.value)} />
                                        <textarea placeholder="Description (Tools used, result)" className="w-full bg-transparent text-sm outline-none h-16"
                                            value={proj.description} onChange={(e) => handleArrayChange('projects', i, 'description', e.target.value)} />
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('projects')} className="text-sm text-blue-400 hover:text-blue-300">+ Add Project</button>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition">Next Step →</button>
                        </div>
                    </div>
                )}

                {/* STEP 2: HISTORY */}
                {step === 2 && (
                    <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-blue-400">Step 2: Experience & Education</h2>

                        {/* Experience */}
                        <div className="mb-8">
                            <label className="block text-sm text-gray-400 mb-2">Work Experience</label>
                            {formData.experience.map((exp, i) => (
                                <div key={i} className="mb-4 p-4 bg-gray-900 rounded border border-gray-700">
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <input type="text" placeholder="Company" className="bg-transparent border-b border-gray-700 p-1 outline-none"
                                            value={exp.company} onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)} />
                                        <input type="text" placeholder="Role" className="bg-transparent border-b border-gray-700 p-1 outline-none"
                                            value={exp.role} onChange={(e) => handleArrayChange('experience', i, 'role', e.target.value)} />
                                    </div>
                                    <textarea placeholder="Responsibilities & Achievements" className="w-full bg-transparent text-sm outline-none h-20 border-t border-gray-800 pt-2"
                                        value={exp.description} onChange={(e) => handleArrayChange('experience', i, 'description', e.target.value)} />
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience')} className="text-sm text-blue-400 hover:text-blue-300">+ Add Experience</button>
                        </div>

                        {/* Education */}
                        <div className="mb-8">
                            <label className="block text-sm text-gray-400 mb-2">Education</label>
                            {formData.education.map((edu, i) => (
                                <div key={i} className="mb-2 p-3 bg-gray-900 rounded border border-gray-700 grid grid-cols-3 gap-4">
                                    <input type="text" placeholder="Degree" className="bg-transparent outline-none"
                                        value={edu.degree} onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)} />
                                    <input type="text" placeholder="University" className="bg-transparent outline-none"
                                        value={edu.school} onChange={(e) => handleArrayChange('education', i, 'school', e.target.value)} />
                                    <input type="text" placeholder="Year" className="bg-transparent outline-none"
                                        value={edu.year} onChange={(e) => handleArrayChange('education', i, 'year', e.target.value)} />
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('education')} className="text-sm text-blue-400 hover:text-blue-300">+ Add Education</button>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">← Back</button>
                            <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition">Next Step →</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: FINISHING TOUCHES */}
                {step === 3 && (
                    <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-blue-400">Step 3: Finishing Touches</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Career Goal</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.careerGoal} onChange={(e) => handleInputChange('careerGoal', e.target.value)} placeholder="e.g. To build AI products..." />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Location Preference</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g. Remote, Bangalore" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tools & Technologies</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.tools} onChange={(e) => handleInputChange('tools', e.target.value)} placeholder="VS Code, Docker, Git..." />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tone</label>
                                <select className="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none"
                                    value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)}>
                                    <option>Professional</option>
                                    <option>Friendly</option>
                                    <option>Confident</option>
                                    <option>Fresh Graduate</option>
                                    <option>Technical</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white">← Back</button>
                            <button onClick={generateProfile} disabled={loading} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-8 py-3 rounded-lg font-bold transition transform hover:scale-105 disabled:opacity-50">
                                {loading ? 'Generating Profile...' : 'Generate LinkedIn Profile ✨'}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: RESULT */}
                {step === 4 && generatedProfile && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-blue-400">Headline</h3>
                                <button onClick={() => copyToClipboard(generatedProfile.headline)} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Copy</button>
                            </div>
                            <p className="text-lg font-medium">{generatedProfile.headline}</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-blue-400">About</h3>
                                <button onClick={() => copyToClipboard(generatedProfile.about)} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Copy</button>
                            </div>
                            <p className="whitespace-pre-wrap text-gray-300">{generatedProfile.about}</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-blue-400">Experience Descriptions</h3>
                            </div>
                            {generatedProfile.experience_descriptions.map((exp, i) => (
                                <div key={i} className="mb-6 last:mb-0">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-white">{exp.role} at {exp.company}</h4>
                                        <button onClick={() => copyToClipboard(exp.description)} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Copy</button>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm text-gray-400 mt-2">{exp.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-blue-400">Recommendation Draft</h3>
                                <button onClick={() => copyToClipboard(generatedProfile.recommendation_draft)} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Copy</button>
                            </div>
                            <p className="whitespace-pre-wrap text-gray-300 italic">"{generatedProfile.recommendation_draft}"</p>
                        </div>

                        <div className="flex justify-center mt-8 gap-4">
                            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">Start Over</button>
                            <button onClick={() => window.location.href = '/'} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg">Back to Home</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
