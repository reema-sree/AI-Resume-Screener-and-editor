'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles, CheckCircle2, AlertTriangle, ExternalLink, Bookmark, ThumbsDown, ArrowRight, Building, MapPin } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = (params?.id as string) || 'job_demo_1';
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const data = await fetchApi(`/jobs/${jobId}`);
        setMatchData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [jobId]);

  const handleInteraction = async (type: string) => {
    try {
      await fetchApi(`/jobs/${jobId}/interaction`, {
        method: 'POST',
        body: JSON.stringify({ interaction_type: type })
      });
      alert(`Feedback logged: ${type}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyClick = async () => {
    await handleInteraction('APPLY');
    // Save to application tracker
    try {
      await fetchApi('/applications', {
        method: 'POST',
        body: JSON.stringify({ job_id: jobId, status: 'APPLIED' })
      });
    } catch (e) {
      console.error(e);
    }
    window.open(matchData?.job?.application_url || 'https://www.linkedin.com', '_blank');
  };

  if (loading || !matchData) {
    return <div className="py-20 text-center text-slate-600 font-semibold">Loading Job & AI Match Specs...</div>;
  }

  const { job, match_score, matching_skills, missing_skills, explanation, recommended_resume_id } = matchData;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                {match_score}% MATCH SCORE
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                Source: {job.source}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{job.title}</h1>
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-slate-400" /> {job.company}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location} ({job.remote_type})</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleInteraction('SAVE')}
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-4 h-4" />
              Save Job
            </button>
            <button
              onClick={handleApplyClick}
              className="px-8 py-3 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
            >
              APPLY NOW
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Why You Match vs Job Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Breakdown Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* WHY YOU MATCH CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              Why You Match ({match_score}% Match Score)
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed p-4 bg-sky-50/70 border border-sky-200 rounded-xl font-medium">
              {explanation?.summary_reason}
            </p>

            {explanation?.major_relevance_notes && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <b>Major Relevance Context:</b> {explanation.major_relevance_notes}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* SKILLS YOU HAVE */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Skills You Have
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {matching_skills.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 bg-white text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 shadow-2xs">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* SKILLS MISSING */}
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Skills Missing
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {missing_skills.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 bg-white text-amber-800 text-xs font-semibold rounded-md border border-amber-200 shadow-2xs">
                      ⚠ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RECOMMENDED RESUME */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-sky-400">RECOMMENDED RESUME FOR THIS ROLE</div>
                <p className="text-slate-300">Software & AI Engineering Resume (Score 86/100)</p>
              </div>
              <Link
                href={`/resumes/${recommended_resume_id || 'demo_resume_1'}/enhance`}
                className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition"
              >
                Tailor Resume
              </Link>
            </div>
          </div>

          {/* Job Description & Requirements */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-sm text-slate-800">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Full Job Description & Requirements</h2>
            <p className="leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        </div>

        {/* Sidebar Specs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Job Overview</h3>
            <div className="space-y-3 text-slate-600">
              <div><span className="font-semibold text-slate-800">Employment Type:</span> {job.employment_type}</div>
              <div><span className="font-semibold text-slate-800">Remote Policy:</span> {job.remote_type}</div>
              <div><span className="font-semibold text-slate-800">Required Experience:</span> {job.experience_required}</div>
              <div><span className="font-semibold text-slate-800">Source Platform:</span> {job.source}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
