'use client';

import { useState, useEffect } from 'react';
import { User, GraduationCap, Briefcase, Save, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    show_outside_roles: true
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProf() {
      const activeUser = getStoredUser();
      try {
        const data = await fetchApi(`/profile/${activeUser.id}`);
        setProfile(data);
      } catch (e) {
        console.error(e);
        setProfile({
          full_name: activeUser.name,
          email: activeUser.email,
          city: 'San Francisco',
          country: 'USA',
          show_outside_roles: true
        });
      }
    }
    loadProf();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const activeUser = getStoredUser();
      await fetchApi(`/profile/${activeUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Identity & Profile</h1>
          <p className="text-sm text-slate-500">Manage your candidate identity details used for job matching.</p>
        </div>
        {saved && (
          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Profile Updated
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                value={profile.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Country</label>
              <input
                type="text"
                value={profile.country || ''}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Show Opportunities Outside Selected Roles</div>
              <p className="text-slate-600">Enables cross-domain recommendations based on skill and project similarity.</p>
            </div>
            <input
              type="checkbox"
              checked={profile.show_outside_roles ?? true}
              onChange={(e) => setProfile({ ...profile, show_outside_roles: e.target.checked })}
              className="w-4 h-4 text-sky-600 rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
