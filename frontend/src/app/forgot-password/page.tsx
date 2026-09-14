'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
        <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send password reset instructions.</p>

        {sent ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>If an account exists for {email}, a password reset link has been dispatched.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 text-white rounded-lg font-semibold text-sm hover:bg-sky-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs text-slate-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
