"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadBox } from "@/components/upload-box";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, FileText, Sparkles } from "lucide-react";

async function analyzeResume(file: File) {
  // TODO: integrate with AI analysis
  return {
    atsScore: 78,
    missingSkills: ["Docker", "Kubernetes", "GraphQL"],
    improvements: [
      "Add quantifiable achievements",
      "Include more action verbs",
      "Optimize keyword density",
    ],
    formatting: [
      "Use consistent font sizes",
      "Add more white space",
      "Align bullet points properly",
    ],
  };
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    const analysis = await analyzeResume(file);
    setResults(analysis);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Resume Analyzer</h1>
        <p className="text-muted-foreground">Get instant ATS scores and improvement suggestions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>Upload a PDF file to analyze</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadBox onFileSelect={setFile} />
          <Button 
            onClick={handleAnalyze} 
            disabled={!file || analyzing}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {analyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl">{results.atsScore}%</CardTitle>
              <CardDescription>ATS Score</CardDescription>
              <Progress value={results.atsScore} className="mt-4" />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Formatting Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.formatting.map((feedback: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
