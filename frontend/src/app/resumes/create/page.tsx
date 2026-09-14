'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save, Plus, Trash2, LayoutTemplate } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const TEMPLATES = [
  { id: 'ats', name: 'ATS Professional' },
  { id: 'swe', name: 'Software Engineer' },
  { id: 'aiml', name: 'AI / ML Specialist' },
  { id: 'robotics', name: 'Robotics & Systems' },
  { id: 'intern', name: 'Student / Intern' },
];

export default function ResumeCreatePage() {
  const router = useRouter();
  const [name, setName] = useState('My Custom Resume');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [selectedTemplate, setSelectedTemplate] = useState('swe');
  const [fullName, setFullName] = useState('Alex Developer');
  const [email, setEmail] = useState('alex.dev@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [summary, setSummary] = useState('Software engineer with expertise in Python, FastAPI, and React.');

  const [skillsText, setSkillsText] = useState('Python, FastAPI, React, Next.js, PostgreSQL, Docker, ROS2, Git');
  const [experienceList, setExperienceList] = useState([
    { company: 'Tech Corp', role: 'Software Engineering Intern', bullet: 'Architected FastAPI microservices for candidate recommendations.' }
  ]);
  const [projectsList, setProjectsList] = useState([
    { title: 'AI Resume Screener', techs: 'Python, FastAPI, React', bullet: 'Developed end-to-end resume scoring and flaw detection app.' }
  ]);
  const [loading, setLoading] = useState(false);

  const addExperience = () => {
    setExperienceList([...experienceList, { company: '', role: '', bullet: '' }]);
  };

  const addProject = () => {
    setProjectsList([...projectsList, { title: '', techs: '', bullet: '' }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      const structured = {
        personal: { full_name: fullName, email, phone, city: 'San Francisco', country: 'USA' },
        education: [{ institution: 'State Tech University', degree: 'B.Tech', major: 'Computer Science', graduation_year: 2025 }],
        experience: experienceList.map(exp => ({ company: exp.company, role: exp.role, bullet_points: [exp.bullet] })),
        projects: projectsList.map(p => ({ title: p.title, technologies: p.techs.split(','), bullet_points: [p.bullet] })),
        skills: {
          programming_languages: skillsArray.slice(0, 3),
          frameworks: skillsArray.slice(3, 5),
          databases: ['PostgreSQL'],
          cloud: ['Docker'],
          ai_ml: ['scikit-learn'],
          robotics: ['ROS2'],
          tools: ['Git']
        },
        certifications: [],
        achievements: [],
        leadership: [],
        publications: [],
        links: []
      };

      const res = await fetchApi('/resumes/create', {
        method: 'POST',
        body: JSON.stringify({
          name,
          target_role: targetRole,
          structured_json: structured
        })
      });
      router.push(`/resumes/${res.id}/analysis`);
    } catch (err) {
      console.error(err);
      router.push('/resumes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Scratch Resume Builder</h1>
          <p className="text-sm text-slate-500">Build a structured ATS-optimized resume from scratch.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition flex items-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save & Analyze'}
        </button>
      </div>

      {/* Template Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          <LayoutTemplate className="w-4 h-4 text-sky-600" /> Template:
        </span>
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setSelectedTemplate(tmpl.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              selectedTemplate === tmpl.id
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tmpl.name}
          </button>
        ))}
      </div>

      {/* Sectional Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Resume Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Label</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Personal Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="px-3 py-2 border rounded-lg text-xs"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">Professional Summary</h3>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3 border rounded-lg text-xs"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">Skills (Comma Separated)</h3>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-xs"
            />
          </div>

          {/* Experience list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Experience</h3>
              <button onClick={addExperience} className="text-xs text-sky-600 font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Job
              </button>
            </div>
            {experienceList.map((exp, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const next = [...experienceList];
                      next[idx].company = e.target.value;
                      setExperienceList(next);
                    }}
                    className="p-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => {
                      const next = [...experienceList];
                      next[idx].role = e.target.value;
                      setExperienceList(next);
                    }}
                    className="p-2 border rounded bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Action Bullet Point"
                  value={exp.bullet}
                  onChange={(e) => {
                    const next = [...experienceList];
                    next[idx].bullet = e.target.value;
                    setExperienceList(next);
                  }}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Formatted Resume Preview */}
        <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-md space-y-6 text-xs text-slate-800">
          <div className="border-b pb-4 text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">{fullName}</h2>
            <p className="text-slate-500">{email} | {phone} | San Francisco, USA</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 uppercase border-b pb-0.5 text-[11px] tracking-wider">Professional Summary</h3>
            <p className="text-slate-600">{summary}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase border-b pb-0.5 text-[11px] tracking-wider">Experience</h3>
            {experienceList.map((exp, i) => (
              <div key={i} className="space-y-0.5">
                <div className="font-bold text-slate-900">{exp.role} @ {exp.company}</div>
                <p className="text-slate-600">• {exp.bullet}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase border-b pb-0.5 text-[11px] tracking-wider">Technical Skills</h3>
            <p className="text-slate-700">{skillsText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
