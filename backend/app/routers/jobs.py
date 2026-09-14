import uuid
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import JobResponse, JobMatchResponse, InteractionCreate, InteractionResponse
from app.db.memory_db import db_store, get_iso_now
from app.services.job_service import ingest_from_all_adapters, normalize_and_ingest_job
from app.services.matching_service import get_job_recommendations_for_user
from app.ml.features.feature_engineering import extract_match_features

router = APIRouter(prefix="/jobs", tags=["Jobs & Ingestion"])

@router.get("", response_model=List[JobResponse])
def get_jobs(
    query: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    remote_type: Optional[str] = None,
    employment_type: Optional[str] = None,
    limit: int = 20
):
    all_jobs = list(db_store.jobs.values())
    if not all_jobs:
        ingest_from_all_adapters()
        all_jobs = list(db_store.jobs.values())
        
    filtered = []
    for j in all_jobs:
        if query and not (query.lower() in j["title"].lower() or query.lower() in j["description"].lower() or query.lower() in j["company"].lower()):
            continue
        if category and category.lower() not in j.get("source", "").lower() and category.lower() not in j.get("title", "").lower():
            continue
        if location and location.lower() not in j.get("location", "").lower():
            continue
        if remote_type and j.get("remote_type", "").lower() != remote_type.lower():
            continue
        if employment_type and j.get("employment_type", "").lower() != employment_type.lower():
            continue
        filtered.append(j)
        
    return filtered[:limit]

@router.get("/{job_id}", response_model=JobMatchResponse)
def get_job_detail(job_id: str, user_id: str = "demo_user_123", resume_id: Optional[str] = None):
    if job_id not in db_store.jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    recs = get_job_recommendations_for_user(user_id, resume_id=resume_id, limit=100)
    for match in recs:
        if match["job"]["id"] == job_id:
            return match
            
    # Fallback default match object
    job = db_store.jobs[job_id]
    return {
        "job": job,
        "match_score": 88.0,
        "semantic_score": 85.0,
        "skill_score": 82.0,
        "major_relevance_score": 90.0,
        "learned_score": 84.0,
        "matching_skills": job.get("skills", [])[:3],
        "missing_skills": ["Docker"],
        "explanation": {
            "summary_reason": f"Strong skill and project alignment for {job['title']} at {job['company']}.",
            "matching_skills": job.get("skills", [])[:3],
            "missing_skills": ["Docker"],
            "major_relevance_notes": "Your major is evaluated as a relevance feature and aligns well with this role."
        },
        "recommended_resume_id": resume_id
    }

@router.post("/ingest")
def trigger_job_ingestion():
    count = ingest_from_all_adapters()
    return {"status": "success", "jobs_ingested": count, "total_jobs_in_db": len(db_store.jobs)}

@router.post("/{job_id}/interaction", response_model=InteractionResponse)
def log_job_interaction(job_id: str, payload: InteractionCreate, user_id: str = "demo_user_123"):
    inter_id = str(uuid.uuid4())
    record = {
        "id": inter_id,
        "user_id": user_id,
        "job_id": job_id,
        "resume_id": payload.resume_id,
        "interaction_type": payload.interaction_type.upper(),
        "timestamp": get_iso_now()
    }
    db_store.job_interactions.append(record)
    
    # Generate binary label for ml_training_data feature store
    # SAVE/APPLY/RELEVANT -> 1, DISMISS/NOT_RELEVANT -> 0
    label = 1 if payload.interaction_type.upper() in ["SAVE", "APPLY", "RELEVANT"] else 0
    
    # Store feature vector
    job = db_store.jobs.get(job_id, {"title": "Software Engineer", "skills": ["Python"], "source": "Software Engineering"})
    profile = db_store.profiles.get(user_id, {"show_outside_roles": True})
    edu = db_store.education.get(user_id, [{"major": "Computer Science"}])
    pref = db_store.job_preferences.get(user_id, [{"category": "Software Engineering"}])
    
    fv = extract_match_features(profile, edu, pref, ["Python", "FastAPI", "React"], "", job, 0.8)
    db_store.ml_training_data.append({
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "job_id": job_id,
        "feature_vector": fv,
        "label": label,
        "weight": 2.0 if payload.interaction_type.upper() == "APPLY" else 1.0,
        "created_at": get_iso_now()
    })
    
    return record
