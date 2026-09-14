'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Briefcase, CheckSquare, Zap, AlertTriangle, ArrowRight, Bookmark, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [mlStatus, setMlStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [recsData, gapsData, statusData] = await Promise.all([
          fetchApi('/recommendations?limit=6'),
          fetchApi('/recommendations/skill-gaps'),
          fetchApi('/ml/status')
        ]);
        setRecommendations(recsData);
        setSkillGaps(gapsData);
        setMlStatus(statusData);
      } catch (e) {
        console.error("Dashboard load fallback: ", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleInteraction = async (jobId: string, type: string) => {
    try {
      await fetchApi(`/jobs/${jobId}/interaction`, {
        method: 'POST',
        body: JSON.stringify({ interaction_type: type })
      });
      // Filter out dismissed
      if (type === 'DISMISS' || type === 'NOT_RELEVANT') {
        setRecommendations(recommendations.filter(r => r.job.id !== jobId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Candidate Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Alex! Here is your AI resume score & job matches summary.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/resumes/upload"
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Upload Resume
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            Job Discovery
          </Link>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
            86
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resume Health</div>
            <div className="text-lg font-bold text-slate-900">86 / 100</div>
            <div className="text-xs text-emerald-600 font-medium">ATS Score: 91%</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
            {recommendations.length || 24}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matching Jobs</div>
            <div className="text-lg font-bold text-slate-900">Matches Profile</div>
            <div className="text-xs text-sky-600 font-medium">8 new today</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
            {skillGaps.length || 3}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Gaps</div>
            <div className="text-lg font-bold text-slate-900">Recommended</div>
            <div className="text-xs text-amber-600 font-medium">Docker, Kubernetes, RAG</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            5
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications</div>
            <div className="text-lg font-bold text-slate-900">In Pipeline</div>
            <div className="text-xs text-slate-500 font-medium">2 Interview stages</div>
          </div>
        </div>
      </div>

      {/* ML Telemetry Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <b>Hybrid ML Ranking Mode:</b> {mlStatus?.cold_start_active ? 'Cold-Start Mode Active (100% Content Matching)' : 'Learned ML Preference Active (70% Content + 30% LogisticRegression)'}. Telemetry recorded: {mlStatus?.interaction_count || 12} interactions.
          </span>
        </div>
        <Link href="/settings" className="text-sky-400 underline font-semibold hover:text-sky-300">
          ML Status
        </Link>
      </div>

      {/* Main Grid: Recommended Jobs + Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              Recommended Jobs For You
            </h2>
            <Link href="/jobs" className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => {
              const { job, match_score, matching_skills, missing_skills, explanation } = rec;
              return (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 transition space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        {match_score}% Match
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{job.title}</h3>
                      <p className="text-sm font-semibold text-slate-600">{job.company} • <span className="font-normal text-slate-500">{job.location} ({job.remote_type})</span></p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {job.source}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {explanation?.summary_reason || job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Top Skills:</span>
                    {matching_skills.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md font-medium border border-sky-100">
                        ✓ {s}
                      </span>
                    ))}
                    {missing_skills.length > 0 && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-medium border border-amber-100">
                        ⚠ Missing: {missing_skills[0]}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInteraction(job.id, 'SAVE')}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                        Save
                      </button>
                      <button
                        onClick={() => handleInteraction(job.id, 'DISMISS')}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 text-slate-500 flex items-center gap-1"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Dismiss
                      </button>
                    </div>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-4 py-1.5 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700 transition flex items-center gap-1"
                    >
                      View Details & Match
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Resume Quick Actions & Skill Gaps */}
        <div className="space-y-6">
          {/* Resume Flaws Quick Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" />
              Resume Diagnostic Status
            </h3>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                2 Flaws Detected in Current Resume
              </div>
              <p className="text-amber-700">Project bullet points lack measurable metrics. Cloud keywords missing.</p>
            </div>

            <div className="space-y-2">
              <Link
                href="/resumes/demo_resume_1/analysis"
                className="block text-center w-full py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800"
              >
                View Detailed Diagnostics
              </Link>
              <Link
                href="/resumes/demo_resume_1/enhance"
                className="block text-center w-full py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-semibold text-xs hover:bg-sky-100"
              >
                Enhance Without Fabrication
              </Link>
            </div>
          </div>

          {/* Recommended Skills to Improve */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Recommended Skills to Improve
            </h3>

            <div className="space-y-3">
              {skillGaps.map((sg) => (
                <div key={sg.skill} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-900">{sg.skill}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${sg.importance === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {sg.importance} PRIORITY
                    </span>
                  </div>
                  <p className="text-slate-600">{sg.reason}</p>
                  <div className="text-[11px] text-slate-400 pt-1">Appears in {sg.market_jobs_count} market postings</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
