"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Award } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { saveInterviewResult } from "@/lib/database";

const results = [
  { question: "Tell me about yourself", score: 85, feedback: "Good structure and clarity" },
  { question: "What are your strengths?", score: 90, feedback: "Excellent examples provided" },
  { question: "Challenging project", score: 75, feedback: "Could add more technical details" },
  { question: "Handle deadlines", score: 80, feedback: "Good time management approach" },
  { question: "5 year goals", score: 88, feedback: "Clear vision and realistic goals" },
];

const strengths = [
  "Clear communication",
  "Good examples",
  "Structured responses",
];

const weaknesses = [
  "Add more technical depth",
  "Include specific metrics",
  "Elaborate on challenges faced",
];

export default function InterviewResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  
  const averageScore = Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length);
  const role = searchParams.get('role') || 'Software Engineer';

  const handleGenerateCertificate = async () => {
    setSaving(true);
    try {
      // Save interview results to database
      const result = await saveInterviewResult(
        role,
        averageScore,
        results,
        strengths,
        weaknesses
      );
      
      // Redirect to certificate generation page
      router.push(`/dashboard/certificates/generate?interviewId=${result.id}`);
    } catch (error) {
      console.error('Error saving interview results:', error);
      alert('Failed to save interview results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Interview Results</h1>
        <p className="text-muted-foreground">Here's how you performed</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl">{averageScore}%</CardTitle>
            <CardDescription>Overall Score</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-orange-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex-1">
                <p className="font-medium">{result.question}</p>
                <p className="text-sm text-muted-foreground">{result.feedback}</p>
              </div>
              <Badge variant={result.score >= 80 ? "default" : "secondary"}>
                {result.score}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1" variant="outline" asChild>
          <Link href="/dashboard/interview">Practice Again</Link>
        </Button>
        <Button 
          className="flex-1" 
          onClick={handleGenerateCertificate}
          disabled={saving}
        >
          <Award className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Generate Certificate'}
        </Button>
      </div>
    </div>
  );
}
