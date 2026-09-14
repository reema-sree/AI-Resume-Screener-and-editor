'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Upload, Download, Sparkles, Trash2, Eye, Edit3 } from 'lucide-react';
import { fetchApi, getResumeDownloadUrl } from '@/lib/api';

export default function ResumesListPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResumes() {
      try {
        const data = await fetchApi('/resumes');
        setResumes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await fetchApi(`/resumes/${id}`, { method: 'DELETE' });
        setResumes(resumes.filter(r => r.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Resume Management</h1>
          <p className="text-sm text-slate-500">Create, upload, analyze, and enhance role-targeted resumes.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/resumes/create"
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Scratch Resume
          </Link>
          <Link
            href="/resumes/upload"
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Upload PDF / DOCX
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((r) => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition">
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-xs font-bold border border-sky-100 uppercase">
                  {r.file_type || 'PDF'}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {r.resume_score || 86}/100 Score
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-3">{r.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Target Role: <span className="font-semibold text-slate-700">{r.target_role || 'Software Engineer'}</span></p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/resumes/${r.id}/analysis`}
                  className="py-2 px-3 bg-slate-900 text-white rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-slate-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI Analysis
                </Link>
                <Link
                  href={`/resumes/${r.id}/enhance`}
                  className="py-2 px-3 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-sky-100"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Enhance
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={getResumeDownloadUrl(r.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 font-semibold hover:text-sky-600 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </a>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-rose-600 font-semibold hover:text-rose-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
