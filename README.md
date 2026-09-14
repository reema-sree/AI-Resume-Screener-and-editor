# AI-Powered Resume Screener, Enhancement & Job Recommendation Platform

A production-quality MVP for an AI-powered Resume Screening, Resume Enhancement, and Personalized Job Recommendation Platform built with Next.js, FastAPI, Supabase PostgreSQL (`pgvector`), Google Gemini API, and `scikit-learn`.

---

## 🌟 Key Platform Features

1. **User Identity & Profile**:
   - Multi-step onboarding collecting Personal Info, Education, and Job Preferences.
   - **Major is stored distinctly**: Evaluated as a relevance feature without acting as a hard filter.
2. **Multi-Select Job Preferences**:
   - Searchable multi-select job role picker covering 15+ engineering/tech categories + custom titles.
   - `[✓] Show opportunities outside my selected roles` enabled by default for cross-domain discovery.
3. **AI Resume Screening Engine**:
   - Detailed ATS compatibility score, technical skills, soft skills, project architecture, and role alignment metrics (0–100).
   - Diagnostic flaw detection identifying unquantified bullet points and weak phrasing with explicit recommendations.
4. **Targeted Resume Enhancement (Strict Non-Fabrication)**:
   - Enhances resume action verbs, ATS keywords, and microservice details.
   - **Zero Fabrication Guarantee**: Never invents false jobs, degrees, unsupplied metrics, or missing experiences.
5. **Resume Builder & PDF Download**:
   - Scratch resume builder with modular sections and pre-designed templates (ATS Professional, Software Engineer, AI/ML, Robotics, Intern, Academic).
   - Formatted PDF export rendered via ReportLab.
6. **Modular Job Aggregation & Normalization**:
   - Modular job source adapters (`LinkedIn`, `Naukri`, `Indeed`, `Instahyre`, `Hirist`, `Greenhouse`, `Lever`, `Company Careers`).
   - Deduplication by Company + Title + Location + Semantic similarity.
7. **Hybrid ML Recommendation Architecture**:
   - **384-dimensional pgvector semantic search** via `sentence-transformers` (`all-MiniLM-L6-v2`).
   - **Personalized Ranking Engine**: `scikit-learn` `LogisticRegression` predicting $P(\text{user interest} \mid \text{features})$ trained on user interaction signals (`VIEW`, `SAVE`, `DISMISS`, `APPLY`, `RELEVANT`, `NOT_RELEVANT`).
   - **Cold Start Handling**: 100% content-based matching for users with $< 50$ interactions; 70% content + 30% learned ML score after 50 interactions.
8. **Explainable Recommendations**:
   - Every job match breaks down match score, "Why You Match", matching skills, missing skills, and recommended resume adjustments.
9. **Application Pipeline Tracker**:
   - Kanban board & table view for tracking application stages (`SAVED`, `APPLIED`, `INTERVIEW`, `REJECTED`, `OFFER`).
10. **Demo Mode Sandbox**:
    - Pre-seeded dataset with 10 fictional users, 20 resumes, 100 job postings, and 50 skills for instant zero-config evaluation.

---

## 🏗️ Repository Architecture

```text
├── backend/
│   ├── app/
│   │   ├── config.py              # Configuration & Settings
│   │   ├── main.py                # FastAPI application entry point
│   │   ├── seed_data.py           # Demo dataset generator (10 users, 20 resumes, 100 jobs)
│   │   ├── db/
│   │   │   ├── schema.sql         # PostgreSQL schema with pgvector & RLS policies
│   │   │   └── memory_db.py       # In-memory fallback DB for zero-config execution
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic schemas
│   │   ├── ml/
│   │   │   ├── embeddings/        # sentence-transformers (all-MiniLM-L6-v2)
│   │   │   ├── features/          # 16-feature vector extraction
│   │   │   ├── ranking/           # LogisticRegression classifier model
│   │   │   ├── training/          # Retraining module from interaction telemetry
│   │   │   ├── inference/         # Hybrid recommendation & cold-start score predictor
│   │   │   └── evaluation/        # ROC-AUC, accuracy, precision, recall metrics
│   │   ├── prompts/               # Prompt templates (parser, analyzer, enhancer, match explainer)
│   │   ├── routers/               # API endpoints (profile, resumes, jobs, recommendations, applications, ml, demo)
│   │   └── services/              # Core business services (resume_service, job_service, matching_service, skill_gap_service)
│   ├── tests/
│   │   └── test_backend.py        # Backend unit & integration tests
│   └── requirements.txt           # Python backend dependencies
│
└── frontend/
    ├── src/
    │   ├── app/                   # Next.js App Router (pages: onboarding, dashboard, profile, resumes, jobs, applications, settings)
    │   ├── components/            # UI components (Navbar, Footer, ScoreCards, Kanban, Filters)
    │   └── lib/                   # API client & Supabase helpers
    ├── package.json               # Node.js dependencies
    ├── tailwind.config.js         # Tailwind CSS styling config
    └── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Quick Start Instructions

### 1. Run FastAPI Backend

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation available at: `http://localhost:8000/docs`

### 2. Run Next.js Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend web application available at: `http://localhost:3000`

---

## 🧪 Verification & Testing

To run backend unit tests validating feature extraction, ML training, and resume parsing:
```bash
cd backend
pytest tests/test_backend.py
```
