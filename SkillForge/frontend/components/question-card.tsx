"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface QuestionCardProps {
  question: string;
  index: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

export function QuestionCard({ question, index, answer, onAnswerChange }: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{question}</p>
        <Textarea
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          rows={4}
        />
      </CardContent>
    </Card>
  );
}
