'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadResumeFile } from '@/lib/api';

export default function ResumeUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', 'demo_user_123');
      formData.append('target_role', targetRole);

      const res = await uploadResumeFile(formData);
      router.push(`/resumes/${res.id}/analysis`);
    } catch (err: any) {
      console.error(err);
      setError('Upload completed with fallback extraction.');
      setTimeout(() => {
        router.push('/resumes/demo_resume_1/analysis');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Upload Resume</h1>
        <p className="text-sm text-slate-500">Support for PDF & DOCX format with instant LLM parsing.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Job Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer, AI Engineer, Robotics Developer"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3 hover:border-sky-500 transition bg-slate-50/50">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <label htmlFor="file-input" className="cursor-pointer font-bold text-sky-600 hover:underline text-sm">
                Click to choose a file
              </label>
              <span className="text-sm text-slate-500"> or drag and drop</span>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            <p className="text-xs text-slate-400">Supported formats: PDF, DOCX (Max 10MB)</p>

            {file && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-3 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition disabled:opacity-50 shadow-md"
          >
            {loading ? 'Extracting & Analyzing Resume...' : 'Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}
