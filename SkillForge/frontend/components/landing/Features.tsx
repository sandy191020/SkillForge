'use client';

import { FileText, TrendingUp, Code, Briefcase, Trophy, Linkedin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: FileText,
    title: 'AI Resume Analyzer',
    description: 'Get instant feedback on your resume with AI-powered analysis and suggestions.',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: TrendingUp,
    title: 'Career Roadmap',
    description: 'Personalized learning paths to reach your target role with curated resources.',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: Code,
    title: 'DSA Dojo',
    description: 'Practice coding problems with AI mentor Yuvi for real-time help.',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    icon: Briefcase,
    title: 'AI Interview Coach',
    description: 'Practice interviews with AI, get scored feedback, and improve your skills.',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: Trophy,
    title: 'Coding Battle Arena',
    description: 'Compete in coding challenges and sharpen your problem-solving skills.',
    color: 'text-red-600 dark:text-red-400',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Optimizer',
    description: 'Generate compelling LinkedIn profiles that attract recruiters.',
    color: 'text-cyan-600 dark:text-cyan-400',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools powered by AI to accelerate your career growth
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
