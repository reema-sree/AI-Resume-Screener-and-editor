'use client';

import Link from 'next/link';
import { Sparkles, FileText, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Zap, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Hybrid Recommendation Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          AI Resume Screening, Enhancement & <span className="text-sky-600">Personalized Job Matching</span>
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          More than an ATS checker. Analyze resume flaws with LLMs, enhance bullet points without fabricating experience, and discover jobs ranked by Machine Learning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
          >
            Start Onboarding
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-800 border border-slate-300 rounded-xl font-bold text-base hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            Launch Demo Sandbox
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">AI Flaw & ATS Diagnostics</h3>
          <p className="text-sm text-slate-600">
            Identifies weak bullet points, unquantified impact, and missing skills. Provides explicit action plans for ATS compatibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero-Fabrication Enhancement</h3>
          <p className="text-sm text-slate-600">
            Enhances resume phrasing without inventing false experiences, degrees, or unsupplied metrics. Strict candidate truth guarantee.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Hybrid ML Recommendation</h3>
          <p className="text-sm text-slate-600">
            Combines 384-dim pgvector semantic embeddings with scikit-learn Logistic Regression learning from user interaction telemetry.
          </p>
        </div>
      </section>

      {/* Non-Restricted Major Highlight */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-8 sm:p-12 rounded-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
          <Zap className="w-4 h-4" />
          <span>Major is a Relevance Feature — Not a Hard Filter</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold">
          Degrees & Majors Never Lock You Out of Opportunities
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          Whether you hold a degree in Computer Science, Mechanical Engineering, Electrical, or Data Science, our matching model combines your major relevance with your actual skills, projects, and custom target role selections.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
          <div className="flex items-center gap-2 text-sky-200">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <span>Cross-domain robotics & software matching</span>
          </div>
          <div className="flex items-center gap-2 text-sky-200">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <span>Multi-select job category preference picker</span>
          </div>
          <div className="flex items-center gap-2 text-sky-200">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <span>"Explore outside usual roles" default enabled</span>
          </div>
          <div className="flex items-center gap-2 text-sky-200">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <span>Explainable match breakdown for every job</span>
          </div>
        </div>
      </section>
    </div>
  );
}
