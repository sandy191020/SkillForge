'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- TYPES ---
type GameState = 'lobby' | 'battle' | 'gameover';

interface Question {
    question: string;
    options: string[];
    correct_index: number;
    difficulty: string;
}

// --- COMPONENTS ---

const HealthBar = ({ current, max, color, label, isRight = false }: { current: number; max: number; color: string; label: string; isRight?: boolean }) => {
    const percent = Math.max(0, (current / max) * 100);
    return (
        <div className={`w-full max-w-md ${isRight ? 'text-right' : 'text-left'}`}>
            <div className="flex justify-between mb-1 text-sm font-bold uppercase tracking-wider text-gray-400">
                <span>{isRight ? `${current}/${max}` : label}</span>
                <span>{isRight ? label : `${current}/${max}`}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                <div
                    className={`h-full bg-${color}-500 transition-all duration-500 ease-out relative`}
                    style={{ width: `${percent}%`, float: isRight ? 'right' : 'left' }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default function GameBoxPage() {
    const [gameState, setGameState] = useState<GameState>('lobby');
    const [playerName, setPlayerName] = useState('');
    const [topic, setTopic] = useState('');
    const [highScore, setHighScore] = useState(0);
    const [score, setScore] = useState(0);

    // Battle State
    const [playerHealth, setPlayerHealth] = useState(100);
    const [aiHealth, setAiHealth] = useState(100);
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(false);
    const [battleLog, setBattleLog] = useState<string[]>([]);

    // Effects
    const [shake, setShake] = useState(false);
    const [flash, setFlash] = useState<'red' | 'green' | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('gameBoxHighScore');
        if (stored) setHighScore(parseInt(stored));
    }, []);

    const addToLog = (msg: string) => {
        setBattleLog(prev => [msg, ...prev].slice(0, 5));
    };

    const startGame = () => {
        if (!playerName || !topic) return;
        setGameState('battle');
        setPlayerHealth(100);
        setAiHealth(100);
        setScore(0);
        setBattleLog(['Battle Started! Good luck!']);
        fetchQuestion();
    };

    const fetchQuestion = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/game/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });
            const data = await response.json();
            setQuestion(data);
        } catch (error) {
            console.error("Failed to get question");
            addToLog("System Error: AI Connection Failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (index: number) => {
        if (!question) return;

        if (index === question.correct_index) {
            // Correct Answer
            const damage = 20;
            setAiHealth(prev => {
                const newHealth = Math.max(0, prev - damage);
                if (newHealth === 0) endGame(true);
                return newHealth;
            });
            setScore(prev => prev + 100);
            setFlash('green');
            addToLog(`CRITICAL HIT! You dealt ${damage} damage!`);
            setTimeout(() => setFlash(null), 300);
            if (aiHealth > 20) fetchQuestion(); // Only fetch if AI not dead
        } else {
            // Wrong Answer
            const damage = 25;
            setPlayerHealth(prev => {
                const newHealth = Math.max(0, prev - damage);
                if (newHealth === 0) endGame(false);
                return newHealth;
            });
            setShake(true);
            setFlash('red');
            addToLog(`MISS! AI counter-attacked for ${damage} damage!`);
            setTimeout(() => {
                setShake(false);
                setFlash(null);
            }, 500);
            if (playerHealth > 25) fetchQuestion(); // Only fetch if Player not dead
        }
    };

    const endGame = (win: boolean) => {
        setGameState('gameover');
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('gameBoxHighScore', score.toString());
        }
    };

    // --- RENDER ---

    return (
        <div className={`min-h-screen bg-gray-900 text-white font-mono overflow-hidden relative ${shake ? 'animate-shake' : ''}`}>

            {/* Flash Effects */}
            {flash === 'red' && <div className="absolute inset-0 bg-red-500/20 z-50 pointer-events-none animate-flash"></div>}
            {flash === 'green' && <div className="absolute inset-0 bg-green-500/20 z-50 pointer-events-none animate-flash"></div>}

            {/* LOBBY */}
            {gameState === 'lobby' && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

                    <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/30 shadow-2xl max-w-md w-full text-center relative z-10">
                        <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] animate-pulse">
                            <span className="text-4xl">⚔️</span>
                        </div>
                        <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest">Game Box</h1>
                        <p className="text-gray-400 mb-8 text-sm">Cyberpunk Quiz Battle Arena</p>

                        <div className="space-y-4 text-left">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Player Name</label>
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-yellow-500 outline-none transition"
                                    placeholder="Enter your alias..."
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Battle Topic</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-yellow-500 outline-none transition"
                                    placeholder="e.g., Space, History, Python..."
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="text-xs text-gray-500 uppercase mb-1">Current High Score</div>
                            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
                        </div>

                        <button
                            onClick={startGame}
                            disabled={!playerName || !topic}
                            className="w-full mt-8 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-lg uppercase tracking-widest transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            Enter Arena
                        </button>

                        <button onClick={() => window.location.href = '/'} className="mt-4 text-gray-500 hover:text-white text-xs uppercase tracking-widest">
                            Exit to Reality
                        </button>
                    </div>
                </div>
            )}

            {/* BATTLE ARENA */}
            {gameState === 'battle' && (
                <div className="flex flex-col h-screen p-4 relative">
                    {/* Top Bar */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-gray-800/80 px-4 py-2 rounded border border-gray-700">
                            <div className="text-xs text-gray-500 uppercase">Score</div>
                            <div className="text-xl font-bold text-yellow-400">{score}</div>
                        </div>
                        <button onClick={() => setGameState('lobby')} className="text-gray-500 hover:text-white">Give Up</button>
                    </div>

                    {/* AI Boss Area */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 bg-red-900/20 rounded-full flex items-center justify-center border-4 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                                <span className="text-6xl animate-bounce">🤖</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase">AI Boss</div>
                        </div>
                        <HealthBar current={aiHealth} max={100} color="red" label="AI Core Integrity" isRight={true} />
                    </div>

                    {/* Center: Question Card */}
                    <div className="flex-1 flex items-center justify-center relative z-20">
                        {loading ? (
                            <div className="text-yellow-500 animate-pulse font-bold tracking-widest">LOADING NEXT CHALLENGE...</div>
                        ) : question ? (
                            <div className="w-full max-w-2xl">
                                <div className="bg-gray-800/90 backdrop-blur border border-gray-600 p-6 rounded-xl shadow-2xl mb-6 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-100">{question.question}</h2>
                                    <div className="absolute top-2 right-2 text-xs text-gray-500 uppercase border border-gray-700 px-2 rounded">{question.difficulty}</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {question.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500 p-4 rounded-lg text-left transition group relative overflow-hidden"
                                        >
                                            <span className="text-yellow-500 font-bold mr-3 group-hover:mr-4 transition-all">{String.fromCharCode(65 + i)}.</span>
                                            <span className="text-gray-300 group-hover:text-white">{opt}</span>
                                            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Bottom: Player Area */}
                    <div className="mt-auto pt-8 flex flex-col items-center">
                        <HealthBar current={playerHealth} max={100} color="green" label={`${playerName}'s HP`} />
                        <div className="mt-4 w-full max-w-2xl h-32 bg-black/50 rounded-t-xl border-t border-x border-gray-800 p-4 overflow-y-auto font-mono text-xs">
                            {battleLog.map((log, i) => (
                                <div key={i} className={`mb-1 ${log.includes('CRITICAL') ? 'text-green-400' : log.includes('MISS') ? 'text-red-400' : 'text-gray-400'}`}>
                                    {'>'} {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* GAME OVER */}
            {gameState === 'gameover' && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black/90 z-50 absolute inset-0">
                    <div className="text-center animate-fade-in-up">
                        <div className="text-6xl mb-4">{playerHealth > 0 ? '🏆' : '💀'}</div>
                        <h1 className={`text-5xl font-black uppercase mb-2 ${playerHealth > 0 ? 'text-yellow-400' : 'text-red-500'}`}>
                            {playerHealth > 0 ? 'Victory!' : 'Game Over'}
                        </h1>
                        <p className="text-gray-400 mb-8 text-xl">
                            {playerHealth > 0 ? 'You defeated the AI Boss!' : 'The AI has consumed your knowledge.'}
                        </p>

                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 mb-8">
                            <div className="text-sm text-gray-500 uppercase mb-1">Final Score</div>
                            <div className="text-4xl font-bold text-white mb-4">{score}</div>
                            {score >= highScore && score > 0 && (
                                <div className="text-green-400 text-sm font-bold animate-pulse">NEW HIGH SCORE!</div>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={startGame}
                                className="bg-white text-black font-bold py-3 px-8 rounded hover:bg-gray-200 transition"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={() => setGameState('lobby')}
                                className="bg-transparent border border-gray-600 text-white font-bold py-3 px-8 rounded hover:bg-gray-800 transition"
                            >
                                Back to Lobby
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-flash { animation: flash 0.3s ease-out; }
      `}</style>
        </div>
    );
}
