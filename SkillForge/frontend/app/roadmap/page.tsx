'use client';

import React, { useState } from 'react';
import RoadmapDisplay from '../../components/RoadmapDisplay';

export default function RoadmapPage() {
    const [formData, setFormData] = useState({
        current_role: '',
        target_role: '',
        skills: ''
    });
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setRoadmap(null);

        try {
            const response = await fetch('http://localhost:8000/roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to generate roadmap');
            }

            const data = await response.json();
            if (data.roadmap) {
                setRoadmap(data.roadmap);
            } else {
                setError('Invalid response format from server');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white">
            <div className="container mx-auto px-4 py-12">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Career Quest
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Chart your path from where you are to where you want to be. Let AI design your personalized level-up strategy.
                    </p>
                </header>

                {!roadmap && (
                    <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-lg p-8 rounded-3xl border border-gray-700 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Current Class (Role)</label>
                                <input
                                    type="text"
                                    name="current_role"
                                    value={formData.current_role}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Student, Junior Dev"
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Target Class (Goal)</label>
                                <input
                                    type="text"
                                    name="target_role"
                                    value={formData.target_role}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Senior AI Engineer, CTO"
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Tree (Current Skills)</label>
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Python, Basic JS, SQL"
                                    rows={3}
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 
                  ${loading
                                        ? 'bg-gray-700 cursor-not-allowed opacity-75'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] hover:shadow-purple-500/25'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Summoning Roadmap...
                                    </span>
                                ) : (
                                    'Start Quest'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {error && (
                    <div className="max-w-xl mx-auto mt-8 p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-center">
                        {error}
                    </div>
                )}

                {roadmap && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={() => setRoadmap(null)}
                                className="text-sm text-gray-400 hover:text-white underline decoration-dotted underline-offset-4"
                            >
                                ← Reroll Character (New Search)
                            </button>
                        </div>
                        <RoadmapDisplay steps={roadmap} />
                    </div>
                )}
            </div>
        </div>
    );
}
