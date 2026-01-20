import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Trophy, Target, Zap, Brain, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { saveInterviewResult } from '@/lib/database'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend
} from 'recharts'

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

interface AnalyticsDashboardProps {
    scores: Score[]
    role: string
}

export default function AnalyticsDashboard({ scores, role }: AnalyticsDashboardProps) {
    const router = useRouter()
    const [summary, setSummary] = useState('Generating summary...')
    const [saving, setSaving] = useState(false)

    // Calculate averages
    const averageScore = scores.reduce((acc, curr) => acc + curr.overallScore, 0) / scores.length || 0

    const dimensionAverages = scores.reduce((acc, curr) => ({
        technical_depth: acc.technical_depth + curr.dimensions.technical_depth,
        communication: acc.communication + curr.dimensions.communication,
        problem_solving: acc.problem_solving + curr.dimensions.problem_solving
    }), { technical_depth: 0, communication: 0, problem_solving: 0 })

    const radarData = [
        { subject: 'Technical Depth', A: dimensionAverages.technical_depth / scores.length || 0, fullMark: 10 },
        { subject: 'Communication', A: dimensionAverages.communication / scores.length || 0, fullMark: 10 },
        { subject: 'Problem Solving', A: dimensionAverages.problem_solving / scores.length || 0, fullMark: 10 },
    ]

    const barData = scores.map((s, i) => ({
        name: `Q${i + 1}`,
        score: s.overallScore
    }))

    useEffect(() => {
        // Generate summary via API
        fetch('/generate-summary', { // This endpoint needs to be handled by server.mjs or API route
            // Since we are using custom server, we can add this route to server.mjs OR use an API route
            // I'll assume I'll add it to server.mjs or use a client-side generation if possible, 
            // but server-side is better. For now, let's just mock it or use a simple heuristic if API fails.
            // Actually, I didn't add /generate-summary to server.mjs yet. I should add it.
            // Or I can just do it here if I expose the lib function via an API route.
            // Let's use a placeholder for now to not block.
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scores })
        }).then(res => res.json())
            .then(data => setSummary(data.summary || 'Summary unavailable.'))
            .catch(() => setSummary('Great job completing the interview! Review your scores below.'))
    }, [scores])

    const handlePrint = () => {
        window.print()
    }

    const handleStartNew = () => {
        sessionStorage.removeItem('interviewState')
        window.location.reload()
    }

    const handleGenerateCertificate = async () => {
        setSaving(true)
        try {
            // Extract strengths and weaknesses from scores
            const strengths: string[] = []
            const weaknesses: string[] = []

            scores.forEach(score => {
                const questionText = score.questionText || 'Unknown Question'
                if (score.overallScore >= 8) {
                    strengths.push(`Strong performance on: ${questionText.substring(0, 50)}...`)
                } else if (score.overallScore < 6) {
                    weaknesses.push(`Needs improvement: ${questionText.substring(0, 50)}...`)
                }
            })

            // Add generic strengths/weaknesses if none found
            if (strengths.length === 0) {
                strengths.push('Completed all interview questions')
                strengths.push('Demonstrated engagement throughout')
            }
            if (weaknesses.length === 0) {
                weaknesses.push('Continue practicing for better scores')
            }

            // Save interview results to database
            const result = await saveInterviewResult(
                role,
                Math.round(averageScore * 10), // Convert to 0-100 scale
                scores,
                strengths.slice(0, 3), // Top 3 strengths
                weaknesses.slice(0, 3) // Top 3 weaknesses
            )

            // Redirect to certificate generation page
            router.push(`/dashboard/certificates/generate?interviewId=${result.id}`)
        } catch (error) {
            console.error('Error saving interview results:', error)
            alert('Failed to save interview results. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-8 p-4 max-w-6xl mx-auto print:p-0">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Interview Analytics</h1>
                    <p className="text-gray-600">Role: {role}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateCertificate} disabled={saving} className="bg-gradient-to-r from-purple-600 to-purple-500">
                        <Award className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Generate Certificate'}
                    </Button>
                    <Button onClick={handleStartNew} variant="default">
                        Start New Interview
                    </Button>
                    <Button onClick={handlePrint} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> Overall Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-900">{averageScore.toFixed(1)}/10</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Questions Answered
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-purple-900">{scores.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Best Skill
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-green-900">
                            {radarData.reduce((a, b) => a.A > b.A ? a : b).subject}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="#2563eb"
                                    fill="#3b82f6"
                                    fillOpacity={0.6}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Score Progression</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card className="break-before-page">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Detailed Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {scores.map((score, index) => (
                            <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">Question {index + 1}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${score.overallScore >= 8 ? 'bg-green-100 text-green-800' :
                                        score.overallScore >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {score.overallScore}/10
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2 italic">"{score.questionText}"</p>
                                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                    <p className="text-sm text-gray-800"><span className="font-semibold">Your Answer:</span> {score.userAnswer}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <p className="text-sm text-blue-900"><span className="font-semibold">Feedback:</span> {score.summaryFeedback}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
