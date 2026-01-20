"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoadmapPhaseProps {
  phase: {
    name: string;
    duration: number;
    subtasks: string[];
    resources: { title: string; url: string }[];
    progress: number;
  };
}

export function RoadmapPhase({ phase }: RoadmapPhaseProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{phase.name}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {phase.duration} weeks
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <Progress value={phase.progress} className="mt-4" />
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Subtasks</h4>
            <ul className="space-y-1">
              {phase.subtasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <div className="space-y-2">
              {phase.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {resource.title}
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
