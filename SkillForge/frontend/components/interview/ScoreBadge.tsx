import React from 'react'

interface Score {
    overallScore: number
    summaryFeedback?: string
}

interface ScoreBadgeProps {
    score: Score
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
    if (!score || typeof score.overallScore !== 'number') return null

    const getColor = (value: number) => {
        if (value >= 8) return 'bg-green-100 text-green-800 border-green-300'
        if (value >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
        return 'bg-red-100 text-red-800 border-red-300'
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getColor(score.overallScore)}`}>
            Score: {score.overallScore}/10
        </span>
    )
}
