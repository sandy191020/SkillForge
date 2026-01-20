"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RoadmapPhase } from "@/components/roadmap-phase";
import { Download, Sparkles } from "lucide-react";

async function generateRoadmap(goal: string) {
  // TODO: integrate with AI
  return [
    {
      name: "Foundation Phase",
      duration: 4,
      subtasks: [
        "Learn basic concepts and terminology",
        "Set up development environment",
        "Complete introductory tutorials",
      ],
      resources: [
        { title: "Official Documentation", url: "#" },
        { title: "Beginner's Guide", url: "#" },
      ],
      progress: 60,
    },
    {
      name: "Intermediate Phase",
      duration: 6,
      subtasks: [
        "Build small projects",
        "Learn best practices",
        "Study design patterns",
      ],
      resources: [
        { title: "Project Ideas", url: "#" },
        { title: "Best Practices Guide", url: "#" },
      ],
      progress: 30,
    },
    {
      name: "Advanced Phase",
      duration: 8,
      subtasks: [
        "Work on complex projects",
        "Contribute to open source",
        "Master advanced concepts",
      ],
      resources: [
        { title: "Advanced Topics", url: "#" },
        { title: "Open Source Projects", url: "#" },
      ],
      progress: 0,
    },
  ];
}

export default function RoadmapPage() {
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!goal) return;
    
    setGenerating(true);
    const generatedRoadmap = await generateRoadmap(goal);
    setRoadmap(generatedRoadmap);
    setGenerating(false);
  };

  const handleDownload = () => {
    // TODO: generate PDF
    console.log("Downloading roadmap...");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Roadmap Maker</h1>
        <p className="text-muted-foreground">Generate personalized learning roadmaps</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Goal</CardTitle>
          <CardDescription>What do you want to learn or achieve?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="e.g., Become a Full-Stack Developer"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={!goal || generating}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? "Generating..." : "Generate Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {roadmap.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Learning Roadmap</h2>
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {roadmap.map((phase, index) => (
            <RoadmapPhase key={index} phase={phase} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
