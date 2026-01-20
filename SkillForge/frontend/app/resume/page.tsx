"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import { analyzeResume, AnalyzeResponse } from '@/lib/api';
import ResultsDashboard from '@/components/ResultsDashboard';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError('Please upload a resume and provide a job description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeResume(file, jobDescription);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 md:p-24 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            AI Resume <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Analyzer</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl max-w-2xl mx-auto"
          >
            Optimize your resume for ATS with AI-powered analysis.
          </motion.p>
        </div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="border border-border bg-card rounded-3xl p-8 md:p-12 max-w-3xl mx-auto space-y-8 shadow-lg"
          >
            {/* Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Upload Resume (PDF)</label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  file 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-border hover:border-primary bg-muted/50'
                }`}>
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-blue-500">
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8 mb-2" />
                      <span>Drag & drop or click to upload</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 bg-background border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
              />
            </div>

            {/* Action Button */}
            <div className="flex flex-col gap-4">
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <button
              onClick={() => setResult(null)}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
            >
              ← Analyze Another
            </button>
            <ResultsDashboard analysis={result.analysis} />
          </div>
        )}
      </div>
    </main>
  );
}
