'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">SkillForge</h3>
            <p className="text-sm">
              AI-powered platform to master your career journey and land your dream job.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resume" className="hover:text-white">Resume Analyzer</Link></li>
              <li><Link href="/roadmap" className="hover:text-white">Career Roadmap</Link></li>
              <li><Link href="/dsa-dojo" className="hover:text-white">DSA Dojo</Link></li>
              <li><Link href="/interview" className="hover:text-white">Interview Coach</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SkillForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
