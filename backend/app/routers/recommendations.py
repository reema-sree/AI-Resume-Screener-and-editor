from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.schemas import JobMatchResponse
from app.services.matching_service import get_job_recommendations_for_user
from app.services.skill_gap_service import analyze_user_skill_gaps

router = APIRouter(prefix="/recommendations", tags=["Personalized Recommendations"])

@router.get("", response_model=List[JobMatchResponse])
def get_recommendations(
    user_id: str = "demo_user_123",
    resume_id: Optional[str] = None,
    limit: int = 15,
    explore_outside_roles: bool = True
):
    recs = get_job_recommendations_for_user(user_id, resume_id=resume_id, limit=limit, explore_outside_roles=explore_outside_roles)
    return recs

@router.get("/skill-gaps")
def get_skill_gaps(user_id: str = "demo_user_123", target_role: str = "Software Engineer"):
    return analyze_user_skill_gaps(user_id, target_role)
