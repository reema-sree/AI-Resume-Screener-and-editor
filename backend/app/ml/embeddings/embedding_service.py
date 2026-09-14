import logging
import numpy as np

logger = logging.getLogger(__name__)

_model_instance = None

def get_embedding_model():
    global _model_instance
    if _model_instance is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model_instance = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer: {e}. Using deterministic fallback embeddings.")
            _model_instance = "FALLBACK"
    return _model_instance

def generate_embedding(text: str) -> list[float]:
    """
    Generates a 384-dimensional vector embedding for the input text.
    """
    if not text or not text.strip():
        return [0.0] * 384
        
    model = get_embedding_model()
    if model != "FALLBACK":
        try:
            vec = model.encode(text, convert_to_numpy=True)
            return vec.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding with model: {e}")
            
    # Deterministic fallback vector generation based on character hashing
    np.random.seed(abs(hash(text)) % (2**32 - 1))
    vec = np.random.normal(0, 1, 384)
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()

def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))
