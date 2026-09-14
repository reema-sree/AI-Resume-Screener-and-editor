import uuid
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ProfileCreate, ProfileUpdate, ProfileResponse, EducationCreate, EducationResponse, JobPreferenceCreate, OnboardingRequest
from app.db.memory_db import db_store, get_iso_now

router = APIRouter(prefix="/profile", tags=["Profile & Onboarding"])

@router.post("", response_model=ProfileResponse)
def create_profile(payload: ProfileCreate):
    profile_id = str(uuid.uuid4())
    prof_dict = payload.model_dump()
    prof_dict["id"] = profile_id
    prof_dict["created_at"] = get_iso_now()
    prof_dict["updated_at"] = get_iso_now()
    db_store.profiles[payload.auth_user_id] = prof_dict
    return prof_dict

@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: str):
    # Try by auth_user_id or direct profile id
    profile = db_store.profiles.get(user_id)
    if not profile:
        for p_key, p_val in db_store.profiles.items():
            if p_val.get("id") == user_id:
                profile = p_val
                break
    if not profile:
        # Return fallback demo profile
        return {
            "id": user_id,
            "auth_user_id": user_id,
            "full_name": "Demo Alex Developer",
            "email": "alex.dev@example.com",
            "phone": "+1 (555) 234-5678",
            "city": "San Francisco",
            "country": "USA",
            "linkedin_url": "https://linkedin.com/in/alexdev",
            "github_url": "https://github.com/alexdev",
            "portfolio_url": "https://alexdev.io",
            "show_outside_roles": True
        }
    return profile

@router.put("/{user_id}", response_model=ProfileResponse)
def update_profile(user_id: str, payload: ProfileUpdate):
    profile = db_store.profiles.get(user_id)
    if not profile:
        profile = {
            "id": user_id,
            "auth_user_id": user_id,
            "full_name": payload.full_name,
            "email": payload.email,
            "phone": payload.phone,
            "city": payload.city,
            "country": payload.country,
            "linkedin_url": payload.linkedin_url,
            "github_url": payload.github_url,
            "portfolio_url": payload.portfolio_url,
            "show_outside_roles": payload.show_outside_roles
        }
    else:
        profile.update(payload.model_dump(exclude_unset=True))
    profile["updated_at"] = get_iso_now()
    db_store.profiles[user_id] = profile
    return profile

@router.post("/onboarding")
def complete_onboarding(payload: OnboardingRequest):
    auth_user_id = payload.auth_user_id
    prof_id = str(uuid.uuid4())
    
    # 1. Profile
    prof_dict = payload.profile.model_dump()
    prof_dict["id"] = prof_id
    prof_dict["auth_user_id"] = auth_user_id
    prof_dict["created_at"] = get_iso_now()
    db_store.profiles[auth_user_id] = prof_dict
    
    # 2. Education (Major stored separately!)
    edu_dict = payload.education.model_dump()
    edu_dict["id"] = str(uuid.uuid4())
    edu_dict["user_id"] = auth_user_id
    db_store.education[auth_user_id] = [edu_dict]
    
    # 3. Preferences (Multi-select job categories)
    prefs = []
    for cat in payload.job_preferences.categories:
        prefs.append({
            "id": str(uuid.uuid4()),
            "user_id": auth_user_id,
            "job_title": cat,
            "category": cat,
            "priority": 1
        })
    for custom in (payload.job_preferences.custom_roles or []):
        prefs.append({
            "id": str(uuid.uuid4()),
            "user_id": auth_user_id,
            "job_title": custom,
            "category": "Custom Role",
            "priority": 2
        })
    db_store.job_preferences[auth_user_id] = prefs
    
    return {
        "status": "success",
        "message": "Onboarding completed successfully.",
        "profile": prof_dict,
        "education": edu_dict,
        "preferences_count": len(prefs)
    }
