import React from 'react'
import { Bot } from 'lucide-react'

export default function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-600">
                <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="px-4 py-3 rounded-2xl bg-gray-200 rounded-tl-sm">
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    )
}
