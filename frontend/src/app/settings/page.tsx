'use client';

import { useState, useEffect } from 'react';
import { Settings, RefreshCw, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function SettingsPage() {
  const [mlStatus, setMlStatus] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);
  const [training, setTraining] = useState(false);
  const [message, setMessage] = useState('');

  const loadStatus = async () => {
    try {
      const data = await fetchApi('/ml/status');
      setMlStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetchApi('/demo/seed', { method: 'POST' });
      setMessage(`Demo data seeded: 10 Users, 20 Resumes, 100 Jobs, 50 Skills.`);
      await loadStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const handleTrainML = async () => {
    setTraining(true);
    try {
      const res = await fetchApi('/ml/train', { method: 'POST' });
      setMessage(`Logistic Regression model trained! Samples: ${res.samples_trained}, Accuracy: ${res.metrics?.accuracy}`);
      await loadStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Platform Settings & Demo Mode</h1>
        <p className="text-sm text-slate-500">Manage demo data sandbox, ML model training, and system telemetry.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Demo Sandbox Controller */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-sky-600" />
          Demo Mode Sandbox Seeder
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Populates 10 fictional users, 20 fictional resumes, 100 job postings across 8 job sources, and 50 standardized skills.
        </p>

        <button
          onClick={handleSeedDemo}
          disabled={seeding}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2"
        >
          {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          {seeding ? 'Seeding Demo Dataset...' : '1-Click Seed Demo Dataset'}
        </button>
      </div>

      {/* Machine Learning Ranking Model Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          Machine Learning Ranking Engine (Logistic Regression)
        </h2>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border">
            <div className="font-bold text-slate-500 uppercase text-[10px]">Model Status</div>
            <div className="text-sm font-bold text-slate-900">{mlStatus?.model_trained ? 'Trained & Saved' : 'Initialized (Cold Start)'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <div className="font-bold text-slate-500 uppercase text-[10px]">Logged Telemetry</div>
            <div className="text-sm font-bold text-slate-900">{mlStatus?.interaction_count || 12} interactions</div>
          </div>
        </div>

        <button
          onClick={handleTrainML}
          disabled={training}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition flex items-center gap-2"
        >
          {training ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
          {training ? 'Training Model...' : 'Trigger Logistic Regression Retraining'}
        </button>
      </div>
    </div>
  );
}
