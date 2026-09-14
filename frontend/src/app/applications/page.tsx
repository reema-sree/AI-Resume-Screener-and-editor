'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, Building, MapPin, Calendar, Clock, Plus, ChevronRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const STAGES = ['SAVED', 'APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER'];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const data = await fetchApi('/applications');
        setApplications(data);
      } catch (e) {
        console.error(e);
        // Fallback demo applications
        setApplications([
          {
            id: 'app_1',
            status: 'INTERVIEW',
            applied_at: '2026-09-10',
            interview_date: '2026-09-18',
            notes: 'Technical phone screen scheduled with lead ML architect.',
            job: { id: 'job_demo_1', title: 'Software Engineer - AI & Backend', company: 'ScaleAI Inc.', location: 'San Francisco, CA' }
          },
          {
            id: 'app_2',
            status: 'APPLIED',
            applied_at: '2026-09-12',
            notes: 'Submitted tailored PDF resume.',
            job: { id: 'job_demo_2', title: 'Autonomous Robotics Software Engineer', company: 'Skydio', location: 'San Mateo, CA' }
          },
          {
            id: 'app_3',
            status: 'SAVED',
            applied_at: '2026-09-14',
            notes: 'Bookmarked for weekend application prep.',
            job: { id: 'job_demo_3', title: 'Machine Learning Engineer', company: 'Anthropic Labs', location: 'Remote' }
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  const updateStage = async (appId: string, newStatus: string) => {
    try {
      await fetchApi(`/applications/${appId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setApplications(applications.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Application Pipeline Tracker</h1>
        <p className="text-sm text-slate-500">Track and manage your job applications across recruitment stages.</p>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = applications.filter((a) => a.status === stage);
          return (
            <div key={stage} className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex flex-col min-w-64 space-y-3">
              <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                <span>{stage}</span>
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {items.map((app) => (
                  <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <h3 className="font-bold text-slate-900 leading-snug">{app.job?.title}</h3>
                    <p className="text-slate-500 font-semibold">{app.job?.company}</p>

                    {app.interview_date && (
                      <div className="px-2 py-1 bg-purple-50 text-purple-700 rounded font-semibold text-[10px] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Interview: {app.interview_date}
                      </div>
                    )}

                    {app.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border">{app.notes}</p>
                    )}

                    {/* Move Stage Selector */}
                    <div className="pt-2 border-t flex items-center justify-between">
                      <select
                        value={app.status}
                        onChange={(e) => updateStage(app.id, e.target.value)}
                        className="text-[10px] bg-slate-50 border rounded px-1.5 py-1 text-slate-700 font-semibold"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <Link href={`/jobs/${app.job?.id}`} className="text-sky-600 font-semibold hover:underline text-[11px]">
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
