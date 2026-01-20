import React from 'react'
import { User, Bot } from 'lucide-react'
import ScoreBadge from './ScoreBadge'

interface Score {
    overallScore: number
    summaryFeedback?: string
}

interface ChatMessageProps {
    message: string
    isUser: boolean
    timestamp: string
    score?: Score
}

export default function ChatMessage({ message, isUser, timestamp, score }: ChatMessageProps) {
    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`px-4 py-3 rounded-2xl ${isUser
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-gray-200 text-gray-900 rounded-tl-sm'
                    }`}>
                    <p className="whitespace-pre-wrap break-words">{message}</p>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{timestamp}</span>
                    {score && <ScoreBadge score={score} />}
                </div>

                {score && score.summaryFeedback && (
                    <div className="mt-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
                        <p className="font-medium text-yellow-800 mb-1">Feedback:</p>
                        <p>{score.summaryFeedback}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
