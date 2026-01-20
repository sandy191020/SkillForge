"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, Map, Award, Code, Trophy, Linkedin, Briefcase } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    title: "Interview Assistant",
    description: "Practice with AI-generated questions",
    icon: Brain,
    href: "/dashboard/interview?new=true",
    color: "text-blue-500",
  },
  {
    title: "Resume Analyzer",
    description: "Get ATS scores and feedback",
    icon: FileText,
    href: "/resume",
    color: "text-green-500",
  },
  {
    title: "Roadmap Maker",
    description: "Generate learning roadmaps",
    icon: Map,
    href: "/roadmap",
    color: "text-purple-500",
  },
  {
    title: "DSA Dojo",
    description: "Practice coding with AI mentor Yuvi",
    icon: Code,
    href: "/dsa-dojo",
    color: "text-cyan-500",
  },
  {
    title: "Game Box",
    description: "Compete in coding battles",
    icon: Trophy,
    href: "/game-box",
    color: "text-red-500",
  },
  {
    title: "Portfolio Maker",
    description: "Generate your portfolio website",
    icon: Briefcase,
    href: "/portfolio",
    color: "text-indigo-500",
  },
  {
    title: "LinkedIn Optimizer",
    description: "Create compelling LinkedIn profiles",
    icon: Linkedin,
    href: "/linkedin",
    color: "text-blue-600",
  },
  {
    title: "Certificates",
    description: "View your achievements",
    icon: Award,
    href: "/dashboard/certificates",
    color: "text-yellow-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Choose a module to get started.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={module.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <module.icon className={`w-12 h-12 ${module.color} mb-2`} />
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
