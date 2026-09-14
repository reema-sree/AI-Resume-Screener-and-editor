import pytest
from app.ml.embeddings.embedding_service import generate_embedding, cosine_similarity
from app.ml.features.feature_engineering import extract_match_features
from app.ml.ranking.ranking_model import ranking_model
from app.ml.training.train_model import retrain_ranking_model_from_interactions
from app.services.resume_service import parse_resume_with_llm, analyze_resume_flaws, enhance_resume_without_fabrication

def test_embeddings_and_similarity():
    emb1 = generate_embedding("Python FastAPI backend developer")
    emb2 = generate_embedding("Python FastAPI backend developer")
    assert len(emb1) == 384
    sim = cosine_similarity(emb1, emb2)
    assert sim > 0.95

def test_feature_engineering_and_ml_training():
    fv = extract_match_features(
        user_profile={"city": "San Francisco", "show_outside_roles": True},
        education=[{"major": "Computer Science"}],
        job_preferences=[{"category": "SOFTWARE ENGINEERING"}],
        candidate_skills=["Python", "FastAPI", "React"],
        resume_text="Software engineer resume",
        job={"title": "Software Engineer", "skills": ["Python", "FastAPI", "Docker"], "source": "SOFTWARE ENGINEERING"},
        semantic_sim=0.85
    )
    assert len(fv) == 16
    
    retrain_res = retrain_ranking_model_from_interactions()
    assert retrain_res["success"] is True
    
    prob = ranking_model.predict_proba(fv)
    assert 0.0 <= prob <= 1.0

def test_resume_services():
    parsed = parse_resume_with_llm("Alex Smith\nalex@example.com\nB.Tech Computer Science\nSkills: Python, React")
    assert "personal" in parsed
    assert "skills" in parsed
    
    analysis = analyze_resume_flaws(parsed, "Software Engineer")
    assert "overall_score" in analysis
    assert "flaws" in analysis
    
    enhanced = enhance_resume_without_fabrication(parsed, "Software Engineer")
    assert "enhanced_resume" in enhanced
    assert "changes_summary" in enhanced
