'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- TYPES ---
type Step = 'topic' | 'difficulty' | 'ide';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Topic = 'Python' | 'Java' | 'C++' | 'C' | 'SQL';

interface Question {
    title: string;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
    starter_code: string;
}

interface ChatMessage {
    role: 'user' | 'yuvi';
    content: string;
}

// --- COMPONENTS ---

const TopicCard = ({ topic, icon, onClick }: { topic: Topic; icon: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 hover:border-red-500 hover:scale-105 transition-all group"
    >
        <div className="text-4xl mb-4 group-hover:text-red-400 transition-colors">{icon}</div>
        <span className="text-xl font-bold text-gray-200 group-hover:text-white">{topic}</span>
    </button>
);

const DifficultyCard = ({ level, color, onClick }: { level: Difficulty; color: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full p-6 rounded-xl border-2 border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all text-left group hover:border-${color}-500`}
    >
        <div className={`text-2xl font-bold text-${color}-400 mb-2 group-hover:text-${color}-300`}>{level}</div>
        <p className="text-gray-400 text-sm">
            {level === 'Easy' && "Perfect for warming up and learning basics."}
            {level === 'Medium' && "Challenge yourself with standard interview problems."}
            {level === 'Hard' && "Push your limits with complex algorithms."}
        </p>
    </button>
);

export default function DSADojoPage() {
    const [step, setStep] = useState<Step>('topic');
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState<Question | null>(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    // Yuvi Bot State
    const [showYuvi, setShowYuvi] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'yuvi', content: "Hi! I'm Yuvi, your AI coding tutor. Stuck? Ask me for a hint!" }
    ]);
    const [userQuery, setUserQuery] = useState('');
    const [yuviThinking, setYuviThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, showYuvi]);

    const handleTopicSelect = (topic: Topic) => {
        setSelectedTopic(topic);
        setStep('difficulty');
    };

    const handleDifficultySelect = async (difficulty: Difficulty) => {
        setSelectedDifficulty(difficulty);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/dsa/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: selectedTopic, difficulty }),
            });

            if (!response.ok) throw new Error('Failed to generate question');

            const data = await response.json();
            setQuestion(data);
            setCode(data.starter_code || '');
            setStep('ide');
        } catch (error) {
            alert('Failed to start Dojo session. Please try again.');
            setStep('topic');
        } finally {
            setLoading(false);
        }
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('Running...');

        try {
            const response = await fetch('http://localhost:8000/dsa/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedTopic?.toLowerCase(),
                    code
                }),
            });

            const data = await response.json();
            if (data.run) {
                setOutput(data.run.output || 'No output');
            } else {
                setOutput('Error executing code');
            }
        } catch (error) {
            setOutput('Failed to execute code');
        } finally {
            setIsRunning(false);
        }
    };

    const handleAskYuvi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userQuery.trim()) return;

        const newHistory = [...chatHistory, { role: 'user', content: userQuery } as ChatMessage];
        setChatHistory(newHistory);
        setUserQuery('');
        setYuviThinking(true);

        try {
            const response = await fetch('http://localhost:8000/dsa/yuvi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    question: JSON.stringify(question),
                    user_query: userQuery
                }),
            });

            const data = await response.json();
            setChatHistory([...newHistory, { role: 'yuvi', content: data.response }]);
        } catch (error) {
            setChatHistory([...newHistory, { role: 'yuvi', content: "I'm having trouble connecting right now. Try again?" }]);
        } finally {
            setYuviThinking(false);
        }
    };

    // --- RENDER STEPS ---

    if (step === 'topic') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">DSA Dojo</h1>
                <p className="text-gray-400 mb-12 text-lg">Choose your weapon (language) to begin training.</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
                    <TopicCard topic="Python" icon="🐍" onClick={() => handleTopicSelect('Python')} />
                    <TopicCard topic="Java" icon="☕" onClick={() => handleTopicSelect('Java')} />
                    <TopicCard topic="C++" icon="⚙️" onClick={() => handleTopicSelect('C++')} />
                    <TopicCard topic="C" icon="C" onClick={() => handleTopicSelect('C')} />
                    <TopicCard topic="SQL" icon="💾" onClick={() => handleTopicSelect('SQL')} />
                </div>

                <button onClick={() => window.location.href = '/'} className="mt-12 text-gray-500 hover:text-white">
                    ← Back to Home
                </button>
            </div>
        );
    }

    if (step === 'difficulty') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                {loading ? (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold">Summoning a Challenge...</h2>
                        <p className="text-gray-400">Consulting the AI Sensei</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-8">Select Difficulty</h1>
                        <div className="flex flex-col gap-4 max-w-md w-full">
                            <DifficultyCard level="Easy" color="green" onClick={() => handleDifficultySelect('Easy')} />
                            <DifficultyCard level="Medium" color="yellow" onClick={() => handleDifficultySelect('Medium')} />
                            <DifficultyCard level="Hard" color="red" onClick={() => handleDifficultySelect('Hard')} />
                        </div>
                        <button onClick={() => setStep('topic')} className="mt-8 text-gray-500 hover:text-white">
                            ← Back to Topics
                        </button>
                    </>
                )}
            </div>
        );
    }

    // --- IDE VIEW ---
    return (
        <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col">
            {/* Header */}
            <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#252526]">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-red-500">DSA Dojo</h1>
                    <span className="text-sm text-gray-400">|</span>
                    <span className="text-sm text-gray-300">{selectedTopic}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${selectedDifficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                            selectedDifficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-red-900 text-red-300'
                        }`}>
                        {selectedDifficulty}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowYuvi(!showYuvi)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition ${showYuvi ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <span>🤖</span> Ask Yuvi
                    </button>
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded text-sm font-medium transition disabled:opacity-50"
                    >
                        {isRunning ? 'Running...' : '▶ Run Code'}
                    </button>
                    <button onClick={() => window.location.href = '/'} className="text-gray-400 hover:text-white text-xl ml-2">×</button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Problem Description */}
                <div className="w-1/3 border-r border-gray-800 bg-[#1e1e1e] flex flex-col overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{question?.title}</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 mb-6">{question?.description}</p>

                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Examples</h3>
                            <div className="space-y-4 mb-6">
                                {question?.examples.map((ex, i) => (
                                    <div key={i} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                        <div className="text-sm"><span className="text-gray-500">Input:</span> <code className="text-gray-300">{ex.input}</code></div>
                                        <div className="text-sm"><span className="text-gray-500">Output:</span> <code className="text-gray-300">{ex.output}</code></div>
                                        {ex.explanation && <div className="text-xs text-gray-500 mt-1">{ex.explanation}</div>}
                                    </div>
                                ))}
                            </div>

                            {question?.constraints && (
                                <>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Constraints</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-400">
                                        {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle: Code Editor & Console */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="absolute inset-0 w-full h-full bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                            spellCheck={false}
                        />
                    </div>

                    {/* Console Output */}
                    <div className="h-48 border-t border-gray-800 bg-[#1e1e1e] flex flex-col">
                        <div className="px-4 py-2 bg-[#252526] text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                            Console Output
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                            {output ? (
                                <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <span className="text-gray-600 italic">Run your code to see output...</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Yuvi Bot (Conditional) */}
                {showYuvi && (
                    <div className="w-80 border-l border-gray-800 bg-[#252526] flex flex-col shadow-xl animate-slide-in-right">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-blue-900/20">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="font-bold text-blue-400">Yuvi AI Tutor</span>
                            </div>
                            <button onClick={() => setShowYuvi(false)} className="text-gray-400 hover:text-white">×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-200'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {yuviThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-400 flex gap-1">
                                        <span className="animate-bounce">●</span>
                                        <span className="animate-bounce delay-100">●</span>
                                        <span className="animate-bounce delay-200">●</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleAskYuvi} className="p-4 border-t border-gray-700 bg-[#252526]">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                    placeholder="Ask for a hint..."
                                    className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500 pr-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!userQuery.trim() || yuviThinking}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-50"
                                >
                                    ➤
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
