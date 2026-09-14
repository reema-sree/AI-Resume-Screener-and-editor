import numpy as np
from app.ml.ranking.ranking_model import ranking_model
from app.db.memory_db import db_store
import logging

logger = logging.getLogger(__name__)

INTERACTION_WEIGHTS = {
    "VIEW": (0, 0.2), # weak negative/neutral
    "DISMISS": (0, 1.0), # strong negative
    "NOT_RELEVANT": (0, 1.5), # strong negative
    "SAVE": (1, 1.0), # positive signal
    "APPLY": (1, 2.0), # strong positive signal
    "RELEVANT": (1, 1.2) # positive signal
}

def retrain_ranking_model_from_interactions() -> dict:
    """
    Scrapes job_interactions and ml_training_data to retrain LogisticRegression.
    """
    X_list = []
    y_list = []
    w_list = []
    
    # Process explicit ml_training_data
    for item in db_store.ml_training_data:
        X_list.append(item["feature_vector"])
        y_list.append(item["label"])
        w_list.append(item.get("weight", 1.0))
        
    if len(X_list) < 5:
        # Generate synthetic bootstrap samples if cold start to ensure initial convergence
        np.random.seed(42)
        for _ in range(30):
            # Positives
            sem = np.random.uniform(0.6, 0.95)
            ovr = np.random.uniform(0.5, 1.0)
            maj = np.random.uniform(0.7, 1.0)
            fv_pos = [sem, ovr, maj, 1.0, 0.8, 1.0, 1.0, 0.8, sem, 4.0, 1.0, 0.8, 0.8, 0.8, 0.85, 1.0]
            X_list.append(fv_pos)
            y_list.append(1)
            w_list.append(1.0)
            
            # Negatives
            sem_neg = np.random.uniform(0.1, 0.4)
            ovr_neg = np.random.uniform(0.0, 0.3)
            maj_neg = np.random.uniform(0.3, 0.7)
            fv_neg = [sem_neg, ovr_neg, maj_neg, 0.5, 0.4, 0.5, 0.5, 0.5, sem_neg, 1.0, 5.0, 0.2, 0.2, 0.2, 0.4, 1.0]
            X_list.append(fv_neg)
            y_list.append(0)
            w_list.append(1.0)
            
    X = np.array(X_list)
    y = np.array(y_list)
    weights = np.array(w_list)
    
    success = ranking_model.train(X, y, sample_weight=weights)
    return {
        "success": success,
        "samples_trained": len(X),
        "is_trained": ranking_model.is_trained
    }
