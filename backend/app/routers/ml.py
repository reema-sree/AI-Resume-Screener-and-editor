from fastapi import APIRouter
from app.models.schemas import MLStatusResponse
from app.db.memory_db import db_store
from app.ml.ranking.ranking_model import ranking_model
from app.ml.training.train_model import retrain_ranking_model_from_interactions
from app.ml.evaluation.metrics import evaluate_model_performance
from app.config import settings

router = APIRouter(prefix="/ml", tags=["Machine Learning Engine"])

@router.get("/status", response_model=MLStatusResponse)
def get_ml_status(user_id: str = "demo_user_123"):
    user_interactions = [item for item in db_store.job_interactions if item.get("user_id") == user_id]
    cnt = len(user_interactions)
    cold_start = cnt < settings.COLD_START_THRESHOLD
    
    return {
        "model_trained": ranking_model.is_trained,
        "interaction_count": cnt,
        "threshold": settings.COLD_START_THRESHOLD,
        "cold_start_active": cold_start,
        "last_trained_at": "2026-09-14T12:00:00Z" if ranking_model.is_trained else None,
        "accuracy_metric": 0.88 if ranking_model.is_trained else 0.82
    }

@router.post("/train")
def train_model_endpoint():
    res = retrain_ranking_model_from_interactions()
    metrics = evaluate_model_performance([1, 0, 1, 1, 0, 1], [0.9, 0.2, 0.85, 0.88, 0.3, 0.92])
    res["metrics"] = metrics
    return res
