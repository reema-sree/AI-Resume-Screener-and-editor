-- ====================================================================
-- AI-Powered Resume Screener, Enhancement & Job Recommendation Schema
-- PostgreSQL with pgvector & Row Level Security (RLS)
-- ====================================================================

-- 1. Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Identity / Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    city TEXT,
    country TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    show_outside_roles BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Education (Degree & Major stored separately)
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    major TEXT NOT NULL, -- Stored separately as a relevance feature, non-hard filter
    specialization TEXT,
    current_year INTEGER,
    graduation_year INTEGER,
    gpa NUMERIC(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Job Preferences (Multi-select job categories & custom titles)
CREATE TABLE IF NOT EXISTS public.job_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    category TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Standardized Skills & User Skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'General'
);

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency TEXT DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced, Expert
    years_experience NUMERIC(3,1) DEFAULT 1.0,
    source TEXT DEFAULT 'User Input', -- User Input, Resume Extracted
    UNIQUE(user_id, skill_id)
);

-- 6. Resumes & Versions
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_role TEXT,
    file_path TEXT,
    file_type TEXT, -- pdf, docx, scratch
    original_text TEXT,
    structured_json JSONB,
    resume_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    structured_json JSONB,
    generated_file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resume_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency TEXT,
    evidence TEXT,
    UNIQUE(resume_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.resume_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE UNIQUE,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Jobs & Job Embeddings
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    location TEXT,
    remote_type TEXT DEFAULT 'Hybrid', -- On-site, Hybrid, Remote
    employment_type TEXT DEFAULT 'Full-time', -- Full-time, Part-time, Internship, Contract
    experience_required TEXT,
    salary_min NUMERIC(12,2),
    salary_max NUMERIC(12,2),
    salary_currency TEXT DEFAULT 'USD',
    source TEXT NOT NULL, -- LinkedIn, Naukri, Indeed, Instahyre, Hirist, Greenhouse, Lever, Company Career Page
    source_url TEXT,
    application_url TEXT,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    importance TEXT DEFAULT 'Required', -- Required, Preferred
    UNIQUE(job_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.job_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE UNIQUE,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Job Matches & Explanations
CREATE TABLE IF NOT EXISTS public.job_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    semantic_score NUMERIC(5,2) DEFAULT 0,
    skill_score NUMERIC(5,2) DEFAULT 0,
    education_score NUMERIC(5,2) DEFAULT 0,
    experience_score NUMERIC(5,2) DEFAULT 0,
    location_score NUMERIC(5,2) DEFAULT 0,
    preference_score NUMERIC(5,2) DEFAULT 0,
    learned_score NUMERIC(5,2) DEFAULT 0,
    final_score NUMERIC(5,2) DEFAULT 0,
    explanation_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- 9. Telemetry & Machine Learning
CREATE TABLE IF NOT EXISTS public.job_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- VIEW, SAVE, DISMISS, APPLY, RELEVANT, NOT_RELEVANT
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ml_training_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    feature_vector JSONB NOT NULL,
    label INTEGER NOT NULL, -- 1 positive, 0 negative
    weight NUMERIC(3,2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Application Tracker
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'APPLIED', -- SAVED, APPLIED, INTERVIEW, REJECTED, OFFER
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    interview_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policy: Users read/write their own records
CREATE POLICY profile_user_policy ON public.profiles FOR ALL USING (auth_user_id = auth.uid());
CREATE POLICY education_user_policy ON public.education FOR ALL USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY pref_user_policy ON public.job_preferences FOR ALL USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY resumes_user_policy ON public.resumes FOR ALL USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY applications_user_policy ON public.applications FOR ALL USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));
