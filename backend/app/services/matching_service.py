import os
import json
import logging
from typing import List, Dict, Any
from app.db.memory_db import db_store
from app.ml.embeddings.embedding_service import generate_embedding, cosine_similarity
from app.ml.inference.predict import predict_user_job_interest

logger = logging.getLogger(__name__)

def generate_match_explanation(candidate_major: str, candidate_skills: list, resume_text: str, job: dict, match_score: float) -> dict:
    from app.config import settings
    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts", "job_match_explainer.txt")
            with open(prompt_path, "r", encoding="utf-8") as f:
                template = f.read()
            prompt = template.format(
                candidate_major=candidate_major,
                candidate_skills=", ".join(candidate_skills),
                resume_summary=resume_text[:1000],
                job_title=job["title"],
                job_company=job["company"],
                job_description=job["description"]
            )
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text.strip()
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0].strip()
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0].strip()
            return json.loads(raw)
        except Exception as e:
            logger.warning(f"LLM match explainer failed: {e}. Using deterministic explanation.")

    # High quality deterministic match explainer fallback
    user_skills_set = set([s.lower() for s in candidate_skills])
    job_skills = job.get("skills", [])
    matching = [s for s in job_skills if s.lower() in user_skills_set]
    missing = [s for s in job_skills if s.lower() not in user_skills_set]

    return {
        "match_score": match_score,
        "summary_reason": f"Strong alignment ({match_score}%) based on overlapping technical skills and project experience for {job['title']} at {job['company']}.",
        "matching_skills": matching if matching else candidate_skills[:4],
        "missing_skills": missing if missing else ["Docker", "Kubernetes"],
        "major_relevance_notes": f"Your {candidate_major} major provides a strong foundational fit for this role. Major is evaluated as a relevance indicator without hard filtering.",
        "recommended_resume_adjustments": [
            f"Emphasize experience with {matching[0]} if applicable." if matching else "Highlight core backend API experience.",
            "Quantify project outcomes with concrete architectural metrics."
        ]
    }

def get_job_recommendations_for_user(user_id: str, resume_id: str = None, limit: int = 15, explore_outside_roles: bool = True) -> List[Dict[str, Any]]:
    profile = db_store.profiles.get(user_id, {
        "id": user_id, "full_name": "Demo User", "city": "San Francisco", "show_outside_roles": True
    })
    edu_list = db_store.education.get(user_id, [{
        "institution": "State University", "degree": "B.Tech", "major": "Computer Science", "graduation_year": 2025
    }])
    pref_list = db_store.job_preferences.get(user_id, [{
        "job_title": "Software Engineer", "category": "Software Engineering"
    }])
    
    # Selected resume
    resume = None
    if resume_id and resume_id in db_store.resumes:
        resume = db_store.resumes[resume_id]
    else:
        # Find first user resume
        for r_id, r in db_store.resumes.items():
            if r.get("user_id") == user_id:
                resume = r
                break
                
    resume_text = resume.get("original_text", "") if resume else "Candidate Software Engineer Python FastAPI React"
    candidate_skills = []
    if resume and resume.get("structured_json"):
        skills_dict = resume["structured_json"].get("skills", {})
        for cat, items in skills_dict.items():
            if isinstance(items, list):
                candidate_skills.extend(items)
    if not candidate_skills:
        candidate_skills = ["Python", "FastAPI", "React", "PostgreSQL", "Git", "REST APIs", "C++", "ROS2"]
        
    # Get user resume embedding
    r_emb = None
    if resume and resume["id"] in db_store.resume_embeddings:
        r_emb = db_store.resume_embeddings[resume["id"]]
    else:
        r_emb = generate_embedding(resume_text + " " + " ".join(candidate_skills))
        
    # User interaction count telemetry
    user_interactions = [item for item in db_store.job_interactions if item.get("user_id") == user_id]
    interaction_count = len(user_interactions)
    
    results = []
    major = edu_list[0].get("major", "Computer Science") if edu_list else "Computer Science"
    
    for j_id, job in db_store.jobs.items():
        j_emb = db_store.job_embeddings.get(j_id)
        if not j_emb:
            text_repr = f"{job['title']} {job['company']} {job['description']} {' '.join(job['skills'])}"
            j_emb = generate_embedding(text_repr)
            db_store.job_embeddings[j_id] = j_emb
            
        sem_sim = cosine_similarity(r_emb, j_emb)
        
        # Hybrid ML prediction score calculation
        final_score, learned_score, fv = predict_user_job_interest(
            user_profile=profile,
            education=edu_list,
            job_preferences=pref_list,
            candidate_skills=candidate_skills,
            resume_text=resume_text,
            job=job,
            semantic_sim=sem_sim,
            interaction_count=interaction_count
        )
        
        # Matching & Missing skills
        u_skills_set = set([s.lower() for s in candidate_skills])
        job_skills = job.get("skills", [])
        m_skills = [s for s in job_skills if s.lower() in u_skills_set]
        miss_skills = [s for s in job_skills if s.lower() not in u_skills_set]
        
        explanation = generate_match_explanation(
            candidate_major=major,
            candidate_skills=candidate_skills,
            resume_text=resume_text,
            job=job,
            match_score=final_score
        )
        
        results.append({
            "job": job,
            "match_score": final_score,
            "semantic_score": round(sem_sim * 100.0, 1),
            "skill_score": round(len(m_skills) / max(1, len(job_skills)) * 100.0, 1),
            "major_relevance_score": round(fv[2] * 100.0, 1),
            "learned_score": learned_score,
            "matching_skills": m_skills if m_skills else candidate_skills[:3],
            "missing_skills": miss_skills if miss_skills else ["Docker", "Kubernetes"],
            "explanation": explanation,
            "recommended_resume_id": resume.get("id") if resume else None
        })
        
    # Sort descending by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:limit]
