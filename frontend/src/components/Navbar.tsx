'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, FileText, Briefcase, CheckSquare, User, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/resumes', label: 'Resumes', icon: FileText },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/applications', label: 'Applications', icon: CheckSquare },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>ResumAI<span className="text-sky-600">Rank</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Onboarding Wizard
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
