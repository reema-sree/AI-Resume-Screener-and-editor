import numpy as np

MAJOR_RELEVANCE_MATRIX = {
    ("computer science", "software engineering"): 1.0,
    ("computer science", "frontend"): 0.9,
    ("computer science", "backend"): 1.0,
    ("computer science", "full stack"): 1.0,
    ("computer science", "ai / ml"): 0.95,
    ("computer science", "robotics"): 0.85,
    ("computer science", "data"): 0.9,
    ("mechanical engineering", "robotics"): 0.85,
    ("electrical engineering", "embedded"): 0.95,
    ("electrical engineering", "robotics"): 0.9,
    ("data science", "data"): 1.0,
    ("data science", "ai / ml"): 0.95,
}

def compute_major_relevance(major: str, job_category: str) -> float:
    if not major or not job_category:
        return 0.7
    m_clean = major.strip().lower()
    c_clean = job_category.strip().lower()
    for (m_key, c_key), score in MAJOR_RELEVANCE_MATRIX.items():
        if m_key in m_clean and c_key in c_clean:
            return score
    return 0.75 # Non-hard filter default relevance!

def extract_match_features(user_profile: dict, education: list, job_preferences: list, candidate_skills: list, resume_text: str, job: dict, semantic_sim: float, interaction_history: list = None) -> list[float]:
    """
    Extracts a 16-element feature vector for (User, Job) pair to feed Logistic Regression.
    """
    job_skills = [s.lower() for s in job.get("skills", [])]
    user_skills_set = set([s.lower() for s in candidate_skills])
    
    # Skill overlap
    matching_count = sum(1 for s in job_skills if s in user_skills_set)
    total_job_skills = max(1, len(job_skills))
    skill_overlap = matching_count / total_job_skills
    missing_count = len(job_skills) - matching_count
    
    # Major relevance
    primary_major = education[0].get("major", "Computer Science") if education else "General Engineering"
    job_category = job.get("source", "Software Engineering")
    major_rel = compute_major_relevance(primary_major, job_category)
    
    # Category preference match
    preferred_categories = set([p.get("category", "").lower() for p in job_preferences])
    category_match = 1.0 if job_category.lower() in preferred_categories else 0.5
    
    # Remote / Location match
    city = (user_profile.get("city") or "").lower()
    job_location = (job.get("location") or "").lower()
    location_match = 1.0 if job.get("remote_type") == "Remote" or (city and city in job_location) else 0.6
    remote_match = 1.0 if job.get("remote_type") in ["Remote", "Hybrid"] else 0.7
    
    # Historical interaction signals
    company = job.get("company", "").lower()
    category = job.get("category", "").lower()
    prev_company_score = 0.5
    prev_category_score = 0.5
    if interaction_history:
        company_hits = sum(1 for item in interaction_history if item.get("company", "").lower() == company and item.get("interaction_type") in ["SAVE", "APPLY"])
        if company_hits > 0:
            prev_company_score = 0.9
        cat_hits = sum(1 for item in interaction_history if item.get("category", "").lower() == category and item.get("interaction_type") in ["SAVE", "APPLY"])
        if cat_hits > 0:
            prev_category_score = 0.85
            
    features = [
        float(semantic_sim), # 0
        float(skill_overlap), # 1
        float(major_rel), # 2
        float(category_match), # 3
        0.8, # 4: experience_match default
        float(location_match), # 5
        float(remote_match), # 6
        0.8, # 7: salary_match default
        float(semantic_sim), # 8: title_similarity approx
        float(matching_count), # 9
        float(missing_count), # 10
        float(prev_company_score), # 11
        float(prev_category_score), # 12
        float(prev_category_score), # 13
        0.85, # 14: resume_role_alignment
        1.0 if user_profile.get("show_outside_roles", True) else 0.0 # 15
    ]
    return features
