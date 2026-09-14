import uuid
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models.schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app.db.memory_db import db_store, get_iso_now

router = APIRouter(prefix="/applications", tags=["Application Tracker"])

@router.get("", response_model=List[ApplicationResponse])
def list_applications(user_id: str = "demo_user_123"):
    user_apps = []
    for (u_id, j_id), app in db_store.applications.items():
        if u_id == user_id:
            job = db_store.jobs.get(j_id, {
                "id": j_id, "title": "Software Engineer", "company": "Tech Company", "description": "", "source": "Direct"
            })
            app_copy = dict(app)
            app_copy["job"] = job
            user_apps.append(app_copy)
    return user_apps

@router.post("", response_model=ApplicationResponse)
def create_application(payload: ApplicationCreate, user_id: str = "demo_user_123"):
    key = (user_id, payload.job_id)
    app_id = str(uuid.uuid4())
    record = {
        "id": app_id,
        "user_id": user_id,
        "job_id": payload.job_id,
        "resume_id": payload.resume_id,
        "status": payload.status.upper(),
        "applied_at": get_iso_now(),
        "notes": payload.notes,
        "interview_date": None,
        "updated_at": get_iso_now()
    }
    db_store.applications[key] = record
    job = db_store.jobs.get(payload.job_id, {
        "id": payload.job_id, "title": "Software Engineer", "company": "Tech Corp", "description": "", "source": "Direct"
    })
    res = dict(record)
    res["job"] = job
    return res

@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(application_id: str, payload: ApplicationUpdate):
    target_key = None
    target_record = None
    for k, v in db_store.applications.items():
        if v.get("id") == application_id:
            target_key = k
            target_record = v
            break
            
    if not target_record:
        raise HTTPException(status_code=404, detail="Application not found")
        
    target_record["status"] = payload.status.upper()
    if payload.notes:
        target_record["notes"] = payload.notes
    if payload.interview_date:
        target_record["interview_date"] = payload.interview_date
    target_record["updated_at"] = get_iso_now()
    
    job = db_store.jobs.get(target_record["job_id"], {
        "id": target_record["job_id"], "title": "Software Engineer", "company": "Tech Corp", "description": "", "source": "Direct"
    })
    res = dict(target_record)
    res["job"] = job
    return res
