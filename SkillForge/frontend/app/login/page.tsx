'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { signIn } = await import('@/lib/auth');
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Form */}
        <div className="bg-[#1a1a2e] p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 mb-8">Login to your account</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="magic@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-gray-400 hover:text-white transition-colors underline">terms of service</a>
              {' '}and{' '}
              <a href="#" className="text-gray-400 hover:text-white transition-colors underline">privacy policy</a>
            </div>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4">SkillForge</h2>
            <p className="text-lg text-white/90 mb-12">
              Master your interviews with AI-powered coaching and real-time feedback
            </p>

            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">AI-powered interview practice</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">Real-time feedback & scoring</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">Personalized coaching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
