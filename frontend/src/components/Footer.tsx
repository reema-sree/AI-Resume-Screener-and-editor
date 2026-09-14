import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-white font-bold text-lg">ResumAIRank Platform</h3>
          <p className="text-xs text-slate-400 mt-1">AI-Powered Resume Analysis, Zero-Fabrication Enhancement & Hybrid Job Recommendation Engine</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/resumes" className="hover:text-white transition">Resumes</Link>
          <Link href="/jobs" className="hover:text-white transition">Job Discovery</Link>
          <Link href="/applications" className="hover:text-white transition">Tracker</Link>
        </div>
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} ResumAIRank. Production MVP.
        </div>
      </div>
    </footer>
  );
}
