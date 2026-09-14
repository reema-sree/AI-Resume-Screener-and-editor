import os
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
import logging

logger = logging.getLogger(__name__)

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models", "logistic_ranking_model.joblib")

class RankingModelWrapper:
    def __init__(self):
        self.model = LogisticRegression(C=1.0, max_iter=500, solver="lbfgs")
        self.is_trained = False
        self._load_model()
        
    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.is_trained = True
                logger.info("Loaded pre-trained LogisticRegression model from disk.")
            except Exception as e:
                logger.error(f"Failed to load ranking model: {e}")

    def train(self, X: np.ndarray, y: np.ndarray, sample_weight: np.ndarray = None):
        """
        Trains the LogisticRegression classifier.
        """
        if len(X) < 5:
            logger.warning("Not enough samples to train model.")
            return False
            
        self.model.fit(X, y, sample_weight=sample_weight)
        self.is_trained = True
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        logger.info(f"Successfully trained and saved LogisticRegression model with {len(X)} samples.")
        return True

    def predict_proba(self, feature_vector: list[float]) -> float:
        """
        Predicts P(user is interested in this job | feature_vector).
        """
        if not self.is_trained:
            # Fallback heuristic before model training: weighted average of top features
            # feature_vector[0]=semantic_sim, feature_vector[1]=skill_overlap, feature_vector[2]=major_rel
            heuristic = 0.4 * feature_vector[0] + 0.35 * feature_vector[1] + 0.25 * feature_vector[2]
            return float(np.clip(heuristic, 0.0, 1.0))
            
        try:
            X = np.array([feature_vector])
            probabilities = self.model.predict_proba(X)
            # Return class 1 probability
            return float(probabilities[0][1])
        except Exception as e:
            logger.error(f"Error predicting ranking probability: {e}")
            return 0.5

ranking_model = RankingModelWrapper()
