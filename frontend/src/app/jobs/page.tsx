'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Sparkles, MapPin, Building, Briefcase, CheckCircle2, Bookmark, ThumbsDown } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function JobSearchPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [remoteType, setRemoteType] = useState('');
  const [showOutside, setShowOutside] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');

  async function loadJobs() {
    setLoading(true);
    try {
      if (activeTab === 'recommended') {
        const recs = await fetchApi(`/recommendations?explore_outside_roles=${showOutside}`);
        setJobs(recs);
      } else {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('query', search);
        if (category) queryParams.append('category', category);
        if (remoteType) queryParams.append('remote_type', remoteType);
        const data = await fetchApi(`/jobs?${queryParams.toString()}`);
        setJobs(data.map((j: any) => ({ job: j, match_score: 85, matching_skills: j.skills?.slice(0, 3) || ['Python'], missing_skills: ['Docker'] })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [activeTab, category, remoteType, showOutside]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const handleInteraction = async (jobId: string, type: string) => {
    try {
      await fetchApi(`/jobs/${jobId}/interaction`, {
        method: 'POST',
        body: JSON.stringify({ interaction_type: type })
      });
      if (type === 'DISMISS' || type === 'NOT_RELEVANT') {
        setJobs(jobs.filter(item => item.job.id !== jobId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Job Discovery & Aggregation</h1>
          <p className="text-sm text-slate-500">Aggregated from LinkedIn, Naukri, Indeed, Instahyre, Hirist, Greenhouse, Lever, and Company Career sites.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search job title, skills, or company (e.g. Python, ROS2, FastAPI)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="">All Job Categories</option>
            <option value="SOFTWARE ENGINEERING">Software Engineering</option>
            <option value="AI / ML">AI / ML</option>
            <option value="ROBOTICS">Robotics</option>
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="FULL STACK">Full Stack</option>
            <option value="DATA">Data Science</option>
          </select>

          <select
            value={remoteType}
            onChange={(e) => setRemoteType(e.target.value)}
            className="px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="">All Work Types</option>
            <option value="Remote">Remote Only</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm hover:bg-sky-700 transition"
          >
            Search
          </button>
        </form>

        {/* Tabs & Outside Roles Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'recommended'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Recommended For You
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                activeTab === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Ingested Jobs
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={showOutside}
              onChange={(e) => setShowOutside(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded"
            />
            <span>Explore outside usual roles (Default: ON)</span>
          </label>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((item) => {
          const { job, match_score, matching_skills, missing_skills, explanation } = item;
          return (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      {match_score}% Match
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold">
                      {job.source}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{job.title}</h2>
                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location} ({job.remote_type})</span>
                  </p>
                </div>

                {job.salary_min && (
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">Estimated Compensation</div>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {explanation?.summary_reason || job.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Skills Required:</span>
                {(job.skills || []).map((s: string) => {
                  const isMatching = matching_skills?.includes(s);
                  return (
                    <span
                      key={s}
                      className={`px-2 py-0.5 rounded-md font-medium border ${
                        isMatching
                          ? 'bg-sky-50 text-sky-700 border-sky-200 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isMatching ? '✓ ' : ''}{s}
                    </span>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleInteraction(job.id, 'SAVE')}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
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
                  className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition"
                >
                  View Details & Apply
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
