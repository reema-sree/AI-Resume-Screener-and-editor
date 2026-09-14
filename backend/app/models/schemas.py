from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Profile Models
class ProfileBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    show_outside_roles: bool = True

class ProfileCreate(ProfileBase):
    auth_user_id: str

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    auth_user_id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# Education Models
class EducationBase(BaseModel):
    institution: str
    degree: str
    major: str  # Stored separately as a relevance feature, non-hard filter
    specialization: Optional[str] = None
    current_year: Optional[int] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: str
    user_id: str

# Job Preference Models
class JobPreferenceCreate(BaseModel):
    categories: List[str]
    custom_roles: Optional[List[str]] = []

class JobPreferenceResponse(BaseModel):
    id: str
    user_id: str
    job_title: str
    category: str
    priority: int = 1

# Onboarding Payload
class OnboardingRequest(BaseModel):
    auth_user_id: str
    profile: ProfileBase
    education: EducationBase
    job_preferences: JobPreferenceCreate

# Resume Models
class SkillCategorized(BaseModel):
    programming_languages: List[str] = []
    frameworks: List[str] = []
    databases: List[str] = []
    cloud: List[str] = []
    ai_ml: List[str] = []
    robotics: List[str] = []
    tools: List[str] = []

class StructuredResume(BaseModel):
    personal: Dict[str, Any] = {}
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    skills: SkillCategorized = SkillCategorized()
    certifications: List[Dict[str, Any]] = []
    achievements: List[str] = []
    leadership: List[str] = []
    publications: List[str] = []
    links: List[str] = []

class ResumeCreate(BaseModel):
    name: str
    target_role: Optional[str] = None
    structured_json: Optional[StructuredResume] = None

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    name: str
    target_role: Optional[str] = None
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    original_text: Optional[str] = None
    structured_json: Optional[Dict[str, Any]] = None
    resume_score: float = 0.0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class FlawItem(BaseModel):
    category: str # Impact, Formatting, Skills, Experience
    problem: str
    current_text: str
    why_weak: str
    suggestion: str
    what_changed: str
    why_better: str
    information_missing: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    resume_id: str
    overall_score: float
    ats_score: float
    skills_score: float
    experience_score: float
    projects_score: float
    impact_score: float
    role_alignment_score: float
    formatting_score: float
    flaws: List[FlawItem] = []
    strong_sections: List[str] = []
    improvements_needed: List[str] = []
    missing_critical_skills: List[str] = []

class ResumeEnhanceRequest(BaseModel):
    target_role: Optional[str] = None
    focus_area: Optional[str] = "all" # all, summary, experience, projects, skills, bullet_points

class ResumeEnhanceResponse(BaseModel):
    resume_id: str
    original_resume: StructuredResume
    enhanced_resume: StructuredResume
    changes_summary: List[Dict[str, str]]
    no_fabrication_disclaimer: str = "All enhancements preserve candidate facts. No missing experiences or skills were fabricated."

# Job Models
class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    skills: List[str] = []
    location: Optional[str] = "Remote"
    remote_type: Optional[str] = "Hybrid"
    employment_type: Optional[str] = "Full-time"
    experience_required: Optional[str] = "0-2 years"
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: Optional[str] = "USD"
    source: str = "Direct"
    source_url: Optional[str] = None
    application_url: Optional[str] = None

class JobResponse(JobCreate):
    id: str
    posted_at: Optional[str] = None

class JobMatchResponse(BaseModel):
    job: JobResponse
    match_score: float
    semantic_score: float
    skill_score: float
    major_relevance_score: float
    learned_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    explanation: Dict[str, Any]
    recommended_resume_id: Optional[str] = None

# Telemetry / Interaction
class InteractionCreate(BaseModel):
    job_id: str
    resume_id: Optional[str] = None
    interaction_type: str # VIEW, SAVE, DISMISS, APPLY, RELEVANT, NOT_RELEVANT

class InteractionResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    interaction_type: str
    timestamp: str

# Application Tracker
class ApplicationCreate(BaseModel):
    job_id: str
    resume_id: Optional[str] = None
    status: str = "APPLIED" # SAVED, APPLIED, INTERVIEW, REJECTED, OFFER
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    interview_date: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    job: JobResponse
    resume_id: Optional[str] = None
    status: str
    applied_at: str
    notes: Optional[str] = None
    interview_date: Optional[str] = None

# ML Status
class MLStatusResponse(BaseModel):
    model_trained: bool
    interaction_count: int
    threshold: int
    cold_start_active: bool
    last_trained_at: Optional[str] = None
    accuracy_metric: Optional[float] = None
