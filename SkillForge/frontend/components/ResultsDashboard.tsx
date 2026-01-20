"use client";

import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    ats_score?: number;
}

interface ResultsDashboardProps {
    analysis: AnalysisResult;
}

export default function ResultsDashboard({ analysis }: ResultsDashboardProps) {
    const atsScore = analysis.ats_score || 0;
    const scoreData = [
        {
            name: 'Score',
            value: atsScore,
            fill: atsScore > 70 ? '#4ade80' : atsScore > 40 ? '#facc15' : '#f87171',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            {/* Score Card */}
            <Card className="border-2">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="80%"
                                outerRadius="100%"
                                barSize={10}
                                data={scoreData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar
                                    background
                                    dataKey="value"
                                    cornerRadius={30 / 2}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-foreground">{atsScore}</span>
                            <span className="text-sm text-muted-foreground">ATS Score</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-semibold text-foreground">Analysis Summary</h3>
                        <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="text-green-500 w-5 h-5" />
                            Strengths
                        </CardTitle>
                        <CardDescription>What your resume does well</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {analysis.strengths && analysis.strengths.length > 0 ? (
                                analysis.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-foreground">{strength}</span>
                                    </li>
                                ))
                            ) : (
                                <span className="text-muted-foreground text-sm">No strengths identified yet.</span>
                            )}
                        </ul>
                    </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="text-yellow-500 w-5 h-5" />
                            Areas to Improve
                        </CardTitle>
                        <CardDescription>What needs attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                                analysis.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-yellow-500 mt-1">!</span>
                                        <span className="text-foreground">{weakness}</span>
                                    </li>
                                ))
                            ) : (
                                <span className="text-muted-foreground text-sm">No weaknesses identified.</span>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Suggestions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="text-blue-500 w-5 h-5" />
                        Actionable Suggestions
                    </CardTitle>
                    <CardDescription>Steps to improve your resume</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {analysis.suggestions && analysis.suggestions.length > 0 ? (
                            analysis.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                    <Badge variant="outline" className="mt-0.5">{idx + 1}</Badge>
                                    <span className="text-sm text-foreground flex-1">{suggestion}</span>
                                </li>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">No suggestions available.</span>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
}
