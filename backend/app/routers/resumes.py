import os
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Response
from typing import List, Optional
from app.models.schemas import ResumeResponse, ResumeAnalysisResponse, ResumeEnhanceRequest, ResumeEnhanceResponse, ResumeCreate
from app.db.memory_db import db_store, get_iso_now
from app.services.resume_service import (
    extract_text_from_file,
    parse_resume_with_llm,
    analyze_resume_flaws,
    enhance_resume_without_fabrication,
    generate_pdf_resume
)
from app.ml.embeddings.embedding_service import generate_embedding

router = APIRouter(prefix="/resumes", tags=["Resumes & AI Analysis"])

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    user_id: str = Form("demo_user_123"),
    name: Optional[str] = Form(None),
    target_role: Optional[str] = Form("Software Engineer")
):
    content = await file.read()
    filename = file.filename or "resume.pdf"
    file_ext = os.path.splitext(filename)[1].lower().replace(".", "")
    
    # 1. Extract text
    raw_text = extract_text_from_file(content, filename)
    
    # 2. LLM Structured Extraction
    structured = parse_resume_with_llm(raw_text)
    
    resume_id = str(uuid.uuid4())
    res_name = name or os.path.splitext(filename)[0]
    
    resume_record = {
        "id": resume_id,
        "user_id": user_id,
        "name": res_name,
        "target_role": target_role,
        "file_path": f"uploads/{resume_id}_{filename}",
        "file_type": file_ext,
        "original_text": raw_text,
        "structured_json": structured,
        "resume_score": 86.0,
        "created_at": get_iso_now(),
        "updated_at": get_iso_now()
    }
    
    db_store.resumes[resume_id] = resume_record
    
    # 3. Generate Embedding
    emb = generate_embedding(raw_text)
    db_store.resume_embeddings[resume_id] = emb
    
    return resume_record

@router.post("/create", response_model=ResumeResponse)
def create_scratch_resume(payload: ResumeCreate, user_id: str = "demo_user_123"):
    resume_id = str(uuid.uuid4())
    structured = payload.structured_json.model_dump() if payload.structured_json else {
        "personal": {"full_name": "New Candidate", "email": "user@example.com"},
        "education": [], "experience": [], "projects": [],
        "skills": {"programming_languages": ["Python", "JavaScript"]},
        "certifications": [], "achievements": [], "leadership": [], "publications": [], "links": []
    }
    raw_text = f"{payload.name} {payload.target_role or ''}"
    
    resume_record = {
        "id": resume_id,
        "user_id": user_id,
        "name": payload.name,
        "target_role": payload.target_role or "Software Engineer",
        "file_path": None,
        "file_type": "scratch",
        "original_text": raw_text,
        "structured_json": structured,
        "resume_score": 80.0,
        "created_at": get_iso_now(),
        "updated_at": get_iso_now()
    }
    db_store.resumes[resume_id] = resume_record
    db_store.resume_embeddings[resume_id] = generate_embedding(raw_text)
    return resume_record

@router.get("", response_model=List[ResumeResponse])
def list_resumes(user_id: str = "demo_user_123"):
    user_resumes = [r for r in db_store.resumes.values() if r.get("user_id") == user_id]
    if not user_resumes:
        # Return fallback demo resume
        demo_r_id = "demo_resume_1"
        if demo_r_id in db_store.resumes:
            return [db_store.resumes[demo_r_id]]
    return user_resumes

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: str):
    if resume_id not in db_store.resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_store.resumes[resume_id]

@router.post("/{resume_id}/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume(resume_id: str, target_role: Optional[str] = "Software Engineer"):
    if resume_id not in db_store.resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume = db_store.resumes[resume_id]
    analysis = analyze_resume_flaws(resume.get("structured_json", {}), target_role or resume.get("target_role", "Software Engineer"))
    analysis["resume_id"] = resume_id
    return analysis

@router.post("/{resume_id}/enhance", response_model=ResumeEnhanceResponse)
def enhance_resume(resume_id: str, req: ResumeEnhanceRequest):
    if resume_id not in db_store.resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume = db_store.resumes[resume_id]
    target_role = req.target_role or resume.get("target_role", "Software Engineer")
    enhanced_data = enhance_resume_without_fabrication(resume.get("structured_json", {}), target_role)
    
    return {
        "resume_id": resume_id,
        "original_resume": resume.get("structured_json", {}),
        "enhanced_resume": enhanced_data.get("enhanced_resume", {}),
        "changes_summary": enhanced_data.get("changes_summary", []),
        "no_fabrication_disclaimer": "All enhancements preserve candidate facts. No missing experiences or skills were fabricated."
    }

@router.get("/{resume_id}/download")
def download_resume_pdf(resume_id: str):
    if resume_id not in db_store.resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume = db_store.resumes[resume_id]
    pdf_bytes = generate_pdf_resume(resume.get("structured_json", {}))
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{resume.get("name", "resume")}.pdf"'}
    )

@router.delete("/{resume_id}")
def delete_resume(resume_id: str):
    if resume_id in db_store.resumes:
        del db_store.resumes[resume_id]
    if resume_id in db_store.resume_embeddings:
        del db_store.resume_embeddings[resume_id]
    return {"status": "success", "message": "Resume deleted successfully"}
