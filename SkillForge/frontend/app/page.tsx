'use client';

import Hero from '@/components/ui/animated-shader-hero';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    // Redirect to signup page
    window.location.href = '/signup';
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Fixed Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-xl">AI</span>
              </div>
              <span className="font-bold text-xl text-white">Career Architect</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </button>
              <Link href="/signup">
                <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-semibold transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero
        trustBadge={{
          text: "Trusted by 10,000+ professionals worldwide",
          icons: ["✨"]
        }}
        headline={{
          line1: "Build Your",
          line2: "Dream Career"
        }}
        subtitle="AI-powered tools to analyze resumes, generate portfolios, chart roadmaps, and master coding interviews."
        buttons={{
          primary: {
            text: "Get Started Free",
            onClick: handleGetStarted
          },
          secondary: {
            text: "Watch Demo",
            onClick: () => scrollToSection('how-it-works')
          }
        }}
      />

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive AI-powered tools to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <FeatureCard
              href="/signup"
              title="Resume Analyzer"
              desc="Get instant ATS scores and expert feedback to optimize your resume for any job."
              icon="📄"
              color="purple"
            />
            <FeatureCard
              href="/signup"
              title="Career Roadmap"
              desc="Interactive step-by-step career paths tailored to your goals and experience."
              icon="🗺️"
              color="blue"
            />
            <FeatureCard
              href="/signup"
              title="Portfolio Maker"
              desc="Generate stunning portfolio websites in seconds with AI-powered design."
              icon="🎨"
              color="green"
            />
            <FeatureCard
              href="/signup"
              title="DSA Dojo"
              desc="Master data structures and algorithms with your personal AI coding tutor."
              icon="🥋"
              color="red"
            />
            <FeatureCard
              href="/signup"
              title="Game Box"
              desc="Battle AI in an interactive cyberpunk quiz arena to test your skills."
              icon="🎮"
              color="yellow"
            />
            <FeatureCard
              href="/signup"
              title="LinkedIn Architect"
              desc="Craft the perfect professional profile that stands out to recruiters."
              icon="💼"
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <StepCard
              number="1"
              title="Choose Your Tool"
              description="Select from our suite of AI-powered career tools based on your needs."
              icon="🎯"
            />
            <StepCard
              number="2"
              title="Input Your Data"
              description="Upload your resume, enter your goals, or provide the information needed."
              icon="📝"
            />
            <StepCard
              number="3"
              title="Get AI Insights"
              description="Receive instant, actionable feedback and recommendations powered by AI."
              icon="🚀"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StatCard number="10K+" label="Active Users" />
            <StatCard number="50K+" label="Resumes Analyzed" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="24/7" label="AI Support" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of professionals who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              name="Sarah Johnson"
              role="Software Engineer"
              company="Google"
              text="The Resume Analyzer helped me land my dream job at Google. The ATS optimization was a game-changer!"
              avatar="👩‍💻"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Data Scientist"
              company="Microsoft"
              text="DSA Dojo made interview prep so much easier. I went from struggling to confident in just 2 weeks."
              avatar="👨‍💼"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Product Manager"
              company="Amazon"
              text="The Career Roadmap feature gave me clear direction. I got promoted within 6 months of using it!"
              avatar="👩‍🎓"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              features={[
                "3 Resume Analyses",
                "Basic Career Roadmap",
                "Community Support",
                "Limited AI Credits"
              ]}
              buttonText="Get Started"
              buttonLink="/signup"
            />
            <PricingCard
              name="Pro"
              price="$19"
              period="per month"
              features={[
                "Unlimited Resume Analyses",
                "Advanced Career Roadmaps",
                "Priority Support",
                "Unlimited AI Credits",
                "Portfolio Generator",
                "LinkedIn Optimizer"
              ]}
              buttonText="Start Free Trial"
              buttonLink="/signup"
              popular={true}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period="contact us"
              features={[
                "Everything in Pro",
                "Team Collaboration",
                "Custom Integrations",
                "Dedicated Support",
                "Advanced Analytics",
                "White-label Options"
              ]}
              buttonText="Contact Sales"
              buttonLink="/signup"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using AI to accelerate their career growth.
          </p>
          <Link href="/signup">
            <button className="px-10 py-4 bg-black hover:bg-gray-900 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl">
              Get Started Free →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">AI</span>
                </div>
                <span className="font-bold text-white">Career Architect</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering careers with AI-powered tools and insights.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Resume Analyzer</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Career Roadmap</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Portfolio Maker</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">DSA Dojo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 AI Career Architect. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ href, title, desc, icon, color }: { href: string, title: string, desc: string, icon: string, color: string }) {
  const colors: any = {
    purple: 'from-purple-500 to-indigo-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-orange-500',
    yellow: 'from-yellow-500 to-amber-500',
    cyan: 'from-cyan-500 to-blue-500',
  };

  return (
    <Link href={href} className="group relative block h-full">
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${colors[color]} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
      <div className="relative h-full p-8 rounded-3xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-[1.02]">
        <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${colors[color]} text-white transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
          {desc}
        </p>
        <div className="mt-6 flex items-center text-sm font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
          Explore <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}

// Step Card Component
function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: string }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-4xl shadow-2xl">
        {icon}
      </div>
      <div className="text-orange-400 font-bold text-sm mb-2">STEP {number}</div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-2">
        {number}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, company, text, avatar }: { name: string, role: string, company: string, text: string, avatar: string }) {
  return (
    <div className="p-8 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-2xl">
          {avatar}
        </div>
        <div>
          <div className="font-bold text-white">{name}</div>
          <div className="text-sm text-gray-400">{role} at {company}</div>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed italic">"{text}"</p>
      <div className="flex gap-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
      </div>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ name, price, period, features, buttonText, buttonLink, popular }: { 
  name: string, 
  price: string, 
  period: string, 
  features: string[], 
  buttonText: string, 
  buttonLink: string,
  popular?: boolean 
}) {
  return (
    <div className={`relative p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
      popular 
        ? 'bg-gradient-to-b from-orange-500/20 to-yellow-500/20 border-orange-500/50' 
        : 'bg-white/5 border-white/10'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-sm font-bold rounded-full">
          MOST POPULAR
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-white">{price}</span>
          <span className="text-gray-400">/{period}</span>
        </div>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-300">
            <span className="text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Link href={buttonLink}>
        <button className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
          popular
            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
        }`}>
          {buttonText}
        </button>
      </Link>
    </div>
  );
}
