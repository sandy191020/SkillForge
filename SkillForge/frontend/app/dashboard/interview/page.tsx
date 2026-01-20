'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, X, BarChart3 } from 'lucide-react'
import ChatMessage from '@/components/interview/ChatMessage'
import TypingIndicator from '@/components/interview/TypingIndicator'
import MicButton from '@/components/interview/MicButton'
import SetupForm from '@/components/interview/SetupForm'
import AnalyticsDashboard from '@/components/interview/AnalyticsDashboard'

interface Message {
    message: string
    isUser: boolean
    timestamp: string
    score?: {
        overallScore: number
        summaryFeedback?: string
        dimensions: any
        tags: string[]
    }
    isStreaming?: boolean
}

interface Stats {
    questionsAsked: number
    averageScore: string | number
    currentQuestion: string
}

interface Score {
    questionId: number
    questionText: string
    userAnswer: string
    overallScore: number
    dimensions: {
        technical_depth: number
        communication: number
        problem_solving: number
    }
    summaryFeedback: string
    tags: string[]
}

type Step = 'setup' | 'interview' | 'analytics'

export default function InterviewPage() {
    const [step, setStep] = useState<Step>('setup')
    const [role, setRole] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [scores, setScores] = useState<Score[]>([])

    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [stats, setStats] = useState<Stats>({
        questionsAsked: 0,
        averageScore: 0,
        currentQuestion: ''
    })
    const [isTTSEnabled, setIsTTSEnabled] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const streamingMessageRef = useRef('')
    const isTTSEnabledRef = useRef(isTTSEnabled)

    // Load state from sessionStorage on mount
    useEffect(() => {
        // Check if user is coming from a fresh navigation
        const urlParams = new URLSearchParams(window.location.search)
        const isNewSession = urlParams.get('new') === 'true'

        if (isNewSession) {
            // Clear saved state for new session
            sessionStorage.removeItem('interviewState')
            return
        }

        const savedState = sessionStorage.getItem('interviewState')
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState)
                setStep(parsed.step)
                setRole(parsed.role)
                setMessages(parsed.messages)
                setScores(parsed.scores)
                setStats(parsed.stats)
                // Don't restore WS here, the other useEffect will handle it based on step/role
            } catch (e) {
                console.error('Failed to parse saved state', e)
                sessionStorage.removeItem('interviewState')
            }
        }
    }, [])

    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        if (step === 'interview' || step === 'analytics') {
            const stateToSave = {
                step,
                role,
                messages,
                scores,
                stats
            }
            sessionStorage.setItem('interviewState', JSON.stringify(stateToSave))
        }
    }, [step, role, messages, scores, stats])

    useEffect(() => {
        isTTSEnabledRef.current = isTTSEnabled
    }, [isTTSEnabled])

    // Text-to-Speech function
    const speakText = (text: string) => {
        if (!isTTSEnabledRef.current || !text) return

        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        utterance.lang = 'en-US'

        // Get available voices and prefer a natural-sounding one
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') || voice.name.includes('Natural'))
        ) || voices.find(voice => voice.lang.startsWith('en'))

        if (preferredVoice) {
            utterance.voice = preferredVoice
        }

        window.speechSynthesis.speak(utterance)
    }

    // Start Interview
    const handleStartInterview = (selectedRole: string) => {
        // Clear any previous session data
        sessionStorage.removeItem('interviewState')
        setMessages([])
        setScores([])
        setStats({
            questionsAsked: 0,
            averageScore: 0,
            currentQuestion: ''
        })

        setRole(selectedRole)

        // Connect to Node.js backend WebSocket
        const wsUrl = 'ws://localhost:5000/interview'
        const websocket = new WebSocket(wsUrl)

        websocket.onopen = () => {
            console.log('WebSocket connected to interview server')
            websocket.send(JSON.stringify({
                type: 'init',
                role: selectedRole
            }))
        }

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            switch (data.type) {
                case 'ai_stream':
                    setIsTyping(true)
                    streamingMessageRef.current += data.chunk
                    setMessages(prev => {
                        const newMessages = [...prev]
                        if (newMessages.length > 0 && newMessages[newMessages.length - 1].isStreaming) {
                            newMessages[newMessages.length - 1].message = streamingMessageRef.current
                        } else {
                            newMessages.push({
                                message: streamingMessageRef.current,
                                isUser: false,
                                timestamp: new Date().toLocaleTimeString(),
                                isStreaming: true
                            })
                        }
                        return newMessages
                    })
                    break

                case 'ai_done':
                    setIsTyping(false)
                    const fullQuestion = streamingMessageRef.current
                    streamingMessageRef.current = ''

                    // Speak the response
                    speakText(fullQuestion)

                    setMessages(prev => {
                        const newMessages = [...prev]
                        if (newMessages.length > 0) {
                            delete newMessages[newMessages.length - 1].isStreaming
                        }
                        return newMessages
                    })
                    setStats(prev => ({
                        ...prev,
                        questionsAsked: prev.questionsAsked + 1,
                        currentQuestion: data.question || ''
                    }))
                    break

                case 'score_update':
                    const newScore = data.payload
                    setScores(prev => [...prev, newScore])

                    setMessages(prev => {
                        const newMessages = [...prev]
                        // Find the last user message and attach score
                        for (let i = newMessages.length - 1; i >= 0; i--) {
                            if (newMessages[i].isUser && !newMessages[i].score) {
                                newMessages[i].score = newScore
                                break
                            }
                        }
                        return newMessages
                    })

                    // Update average score
                    setStats(prev => {
                        const currentScores = [...scores, newScore].map(s => s.overallScore)
                        const avg = currentScores.reduce((a, b) => a + b, 0) / currentScores.length
                        return { ...prev, averageScore: avg.toFixed(1) }
                    })
                    break

                case 'greeting':
                    setMessages([{
                        message: data.message,
                        isUser: false,
                        timestamp: new Date().toLocaleTimeString()
                    }])
                    speakText(data.message)
                    break
            }
        }

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error)
            alert('Failed to connect to interview server.')
        }

        setWs(websocket)
        setStep('interview')
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Cleanup TTS on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
        }
    }, [])

    const sendMessage = (text: string) => {
        if (!text.trim() || !ws) return

        const userMessage: Message = {
            message: text,
            isUser: true,
            timestamp: new Date().toLocaleTimeString()
        }

        setMessages(prev => [...prev, userMessage])
        ws.send(JSON.stringify({ type: 'user_message', message: text }))
        setInputValue('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(inputValue)
    }

    const handleTranscript = (text: string) => {
        // If text is an error message from STT, don't send it as a message
        if (text.startsWith('Voice input failed') || text.startsWith('Voice input unavailable')) {
            alert(text)
            return
        }

        // Auto-send the transcript for better flow
        if (text.trim()) {
            sendMessage(text.trim())
        }
    }

    const handleEndInterview = () => {
        if (ws) ws.close()
        setStep('analytics')
    }

    // Render Steps
    if (step === 'setup') {
        return <SetupForm onStart={handleStartInterview} />
    }

    if (step === 'analytics') {
        return <AnalyticsDashboard scores={scores} role={role} />
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Interview in Progress</h1>
                        <p className="text-sm text-gray-600">{role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isTTSEnabled
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            {isTTSEnabled ? '🔊 TTS On' : '🔇 TTS Off'}
                        </button>
                        <button
                            onClick={handleEndInterview}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            <X className="w-4 h-4" />
                            Finish & View Analysis
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            message={msg.message}
                            isUser={msg.isUser}
                            timestamp={msg.timestamp}
                            score={msg.score}
                        />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white border-t p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your answer..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        <MicButton onTranscript={handleTranscript} />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Sidebar - Stats */}
            <div className="w-80 bg-white border-l p-6 hidden lg:block">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Live Stats</h2>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-1">Questions Asked</div>
                        <div className="text-3xl font-bold text-blue-900">{stats.questionsAsked}</div>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="text-sm text-green-600 font-medium mb-1">Average Score</div>
                        <div className="text-3xl font-bold text-green-900">
                            {stats.averageScore || '—'}/10
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium mb-2">Current Question</div>
                        <div className="text-sm text-purple-900">
                            {stats.currentQuestion || 'Waiting for question...'}
                        </div>
                    </div>

                    <button
                        onClick={handleEndInterview}
                        className="w-full py-3 mt-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        View Analysis
                    </button>
                </div>
            </div>
        </div>
    )
}
