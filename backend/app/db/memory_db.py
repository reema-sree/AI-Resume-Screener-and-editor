"""
In-memory and JSON storage fallback for local development and zero-config execution.
Allows the platform to run seamlessly even without active Supabase connections.
"""

import uuid
from datetime import datetime, timezone

def get_iso_now():
    return datetime.now(timezone.utc).isoformat()

class MemoryStore:
    def __init__(self):
        self.profiles = {} # auth_user_id -> profile_dict
        self.education = {} # user_id -> list of edu_dict
        self.job_preferences = {} # user_id -> list of pref_dict
        self.user_skills = {} # user_id -> list of skill_dict
        self.resumes = {} # resume_id -> resume_dict
        self.resume_versions = {} # resume_id -> list of version_dict
        self.jobs = {} # job_id -> job_dict
        self.resume_embeddings = {} # resume_id -> vector list
        self.job_embeddings = {} # job_id -> vector list
        self.job_matches = {} # (user_id, job_id) -> match_dict
        self.job_interactions = [] # list of interaction_dict
        self.ml_training_data = [] # list of training_dict
        self.applications = {} # (user_id, job_id) -> app_dict
        self.skills_catalog = {
            "Python": "Programming", "JavaScript": "Programming", "TypeScript": "Programming",
            "C++": "Programming", "Java": "Programming", "Go": "Programming", "Rust": "Programming",
            "React": "Frontend", "Next.js": "Frontend", "Tailwind CSS": "Frontend", "Vue": "Frontend",
            "FastAPI": "Backend", "Node.js": "Backend", "Express": "Backend", "Django": "Backend",
            "PyTorch": "AI/ML", "TensorFlow": "AI/ML", "scikit-learn": "AI/ML", "NLP": "AI/ML",
            "Computer Vision": "AI/ML", "LLM": "AI/ML", "RAG": "AI/ML", "pgvector": "AI/ML",
            "ROS2": "Robotics", "Gazebo": "Robotics", "SLAM": "Robotics", "MoveIt": "Robotics",
            "Docker": "DevOps", "Kubernetes": "DevOps", "AWS": "Cloud", "PostgreSQL": "Database",
            "Git": "Tools", "REST APIs": "Backend", "GraphQL": "Backend"
        }

db_store = MemoryStore()
