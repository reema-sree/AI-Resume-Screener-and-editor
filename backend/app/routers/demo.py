from fastapi import APIRouter
from app.seed_data import seed_demo_dataset

router = APIRouter(prefix="/demo", tags=["Demo Mode"])

@router.post("/seed")
def seed_demo_data():
    stats = seed_demo_dataset()
    return {
        "status": "success",
        "message": "Demo data populated successfully with 10 users, 20 resumes, 100 jobs, and 50 skills.",
        "stats": stats
    }
