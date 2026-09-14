from app.ml.ranking.ranking_model import ranking_model
from app.ml.features.feature_engineering import extract_match_features

def predict_user_job_interest(user_profile: dict, education: list, job_preferences: list, candidate_skills: list, resume_text: str, job: dict, semantic_sim: float, interaction_count: int, threshold: int = 50) -> tuple[float, float, list[float]]:
    """
    Computes hybrid recommendation score:
    - If interactions < threshold (Cold Start): 100% content-based score
    - If interactions >= threshold: 70% content-based score + 30% learned ML preference score
    """
    feature_vector = extract_match_features(user_profile, education, job_preferences, candidate_skills, resume_text, job, semantic_sim)
    
    # Content-based score formula:
    # 35% semantic similarity
    # 20% skill overlap
    # 15% experience compatibility
    # 10% education/major relevance
    # 10% job preference relevance
    # 5% location compatibility
    # 5% other profile compatibility
    semantic_score = feature_vector[0] * 100.0
    skill_score = feature_vector[1] * 100.0
    major_score = feature_vector[2] * 100.0
    pref_score = feature_vector[3] * 100.0
    loc_score = feature_vector[5] * 100.0
    
    content_score = (
        0.35 * semantic_score +
        0.20 * skill_score +
        0.15 * 80.0 + # experience compatibility default
        0.10 * major_score +
        0.10 * pref_score +
        0.05 * loc_score +
        0.05 * 85.0
    )
    
    learned_prob = ranking_model.predict_proba(feature_vector)
    learned_score = learned_prob * 100.0
    
    if interaction_count < threshold:
        final_score = content_score
    else:
        final_score = 0.70 * content_score + 0.30 * learned_score
        
    return float(round(final_score, 1)), float(round(learned_score, 1)), feature_vector
