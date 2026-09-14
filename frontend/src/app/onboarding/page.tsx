'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, GraduationCap, Briefcase, CheckCircle2, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const PRESET_CATEGORIES = [
  "SOFTWARE ENGINEERING", "FRONTEND", "BACKEND", "FULL STACK",
  "AI / ML", "DATA", "CLOUD / DEVOPS", "CYBERSECURITY",
  "ROBOTICS", "EMBEDDED", "MOBILE", "QA",
  "PRODUCT / TECHNICAL", "RESEARCH", "OTHER ENGINEERING"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 - Personal Info
  const [fullName, setFullName] = useState('Alex Developer');
  const [email, setEmail] = useState('alex.dev@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('USA');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/alexdev');
  const [github, setGithub] = useState('https://github.com/alexdev');
  const [portfolio, setPortfolio] = useState('https://alexdev.io');

  // Step 2 - Education (Major stored distinctly!)
  const [institution, setInstitution] = useState('State Tech University');
  const [degree, setDegree] = useState('B.Tech');
  const [major, setMajor] = useState('Computer Science Engineering');
  const [specialization, setSpecialization] = useState('Artificial Intelligence & Machine Learning');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [gpa, setGpa] = useState('3.85');

  // Step 3 - Job Preferences (Searchable Multi-Select)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "SOFTWARE ENGINEERING", "AI / ML", "ROBOTICS"
  ]);
  const [customRoles, setCustomRoles] = useState<string[]>(["Autonomous Systems Engineer"]);
  const [customInput, setCustomInput] = useState('');
  const [showOutsideRoles, setShowOutsideRoles] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const addCustomRole = () => {
    if (customInput.trim() && !customRoles.includes(customInput.trim())) {
      setCustomRoles([...customRoles, customInput.trim()]);
      setCustomInput('');
    }
  };

  const removeCustomRole = (role: string) => {
    setCustomRoles(customRoles.filter((r) => r !== role));
  };

  const handleSubmitOnboarding = async () => {
    setLoading(true);
    try {
      const payload = {
        auth_user_id: 'demo_user_123',
        profile: {
          full_name: fullName,
          email,
          phone,
          city,
          country,
          linkedin_url: linkedin,
          github_url: github,
          portfolio_url: portfolio,
          show_outside_roles: showOutsideRoles
        },
        education: {
          institution,
          degree,
          major, // Stored distinctly!
          specialization,
          graduation_year: parseInt(graduationYear) || 2025,
          gpa: parseFloat(gpa) || 3.8
        },
        job_preferences: {
          categories: selectedCategories,
          custom_roles: customRoles
        }
      };

      await fetchApi('/profile/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      router.push('/resumes/upload');
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = PRESET_CATEGORIES.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className={`flex items-center gap-2 font-semibold text-sm ${step >= 1 ? 'text-sky-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>1</div>
          <span>Personal Info</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-4" />
        <div className={`flex items-center gap-2 font-semibold text-sm ${step >= 2 ? 'text-sky-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>2</div>
          <span>Education</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-4" />
        <div className={`flex items-center gap-2 font-semibold text-sm ${step >= 3 ? 'text-sky-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>3</div>
          <span>Job Preferences</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-600" />
                Step 1 — Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">Build your user identity profile.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Portfolio URL</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-semibold text-sm hover:bg-sky-700 transition flex items-center gap-2"
              >
                Next: Education
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EDUCATION */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                Step 2 — Education & Major
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your major is stored as a relevance feature and will never act as a hard filter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">University / Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Degree</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech, B.S., M.S."
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Major (Stored Separately)</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Mechanical Eng"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 border border-sky-300 bg-sky-50/50 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. AI/ML, Robotics"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">GPA / CGPA</label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-50 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-semibold text-sm hover:bg-sky-700 transition flex items-center gap-2"
              >
                Next: Job Preferences
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: JOB PREFERENCES (Multi-Select) */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-600" />
                Step 3 — Job Roles & Categories (Multi-Select)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select multiple job categories you are interested in exploring. You can also add custom roles.
              </p>
            </div>

            {/* Category Search & Multi-Select */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search job categories (e.g. Robotics, AI / ML, Full Stack)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />

              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
                {filteredCategories.map((cat) => {
                  const selected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                        selected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Roles Add */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Add Custom Job Titles</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Autonomous Robotics Developer, Generative AI Specialist"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomRole}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {customRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {customRoles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-sky-100 text-sky-800 rounded-md text-xs font-medium flex items-center gap-1"
                    >
                      {role}
                      <button onClick={() => removeCustomRole(role)}>
                        <X className="w-3 h-3 text-sky-600 hover:text-sky-900" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Outside Roles Checkbox */}
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex items-start gap-3">
              <input
                type="checkbox"
                id="outsideRoles"
                checked={showOutsideRoles}
                onChange={(e) => setShowOutsideRoles(e.target.checked)}
                className="mt-1 w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <label htmlFor="outsideRoles" className="text-xs text-slate-800 cursor-pointer leading-relaxed">
                <span className="font-bold block">✓ Show opportunities outside my selected roles (Default: ON)</span>
                Ensures you discover high-matching cross-domain roles (e.g. CS major + Python/ROS2 skills matching Robotics Software Engineer opportunities).
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-50 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleSubmitOnboarding}
                disabled={loading}
                className="px-8 py-2.5 bg-sky-600 text-white rounded-lg font-bold text-sm hover:bg-sky-700 transition flex items-center gap-2 shadow-md"
              >
                {loading ? 'Completing...' : 'Complete & Upload Resume'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
