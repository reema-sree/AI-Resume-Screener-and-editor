import uuid
import logging
from typing import List, Dict, Any
from app.db.memory_db import db_store, get_iso_now
from app.ml.embeddings.embedding_service import generate_embedding, cosine_similarity
from app.services.job_sources.adapters import ALL_JOB_ADAPTERS

logger = logging.getLogger(__name__)

def normalize_and_ingest_job(raw_job: dict) -> dict:
    title = raw_job.get("title", "Software Engineer").strip()
    company = raw_job.get("company", "Tech Company").strip()
    location = raw_job.get("location", "Remote").strip()
    
    # Check for duplicates using Title + Company + Location
    for existing_id, job in db_store.jobs.items():
        if (job["title"].lower() == title.lower() and 
            job["company"].lower() == company.lower() and 
            job["location"].lower() == location.lower()):
            logger.info(f"Duplicate job detected for {title} @ {company}. Skipping ingestion.")
            return job
            
    job_id = str(uuid.uuid4())
    norm_job = {
        "id": job_id,
        "title": title,
        "company": company,
        "description": raw_job.get("description", ""),
        "skills": raw_job.get("skills", []),
        "location": location,
        "remote_type": raw_job.get("remote_type", "Hybrid"),
        "employment_type": raw_job.get("employment_type", "Full-time"),
        "experience_required": raw_job.get("experience_required", "0-2 years"),
        "salary_min": raw_job.get("salary_min"),
        "salary_max": raw_job.get("salary_max"),
        "salary_currency": raw_job.get("salary_currency", "USD"),
        "source": raw_job.get("source", "Aggregator"),
        "source_url": raw_job.get("source_url", ""),
        "application_url": raw_job.get("application_url", raw_job.get("source_url", "")),
        "posted_at": get_iso_now(),
        "created_at": get_iso_now(),
        "updated_at": get_iso_now()
    }
    
    # Store in DB
    db_store.jobs[job_id] = norm_job
    
    # Generate job embedding
    text_repr = f"{norm_job['title']} {norm_job['company']} {norm_job['description']} {' '.join(norm_job['skills'])}"
    emb = generate_embedding(text_repr)
    db_store.job_embeddings[job_id] = emb
    
    return norm_job

def ingest_from_all_adapters() -> int:
    total_ingested = 0
    for adapter in ALL_JOB_ADAPTERS:
        try:
            jobs = adapter.fetch_jobs()
            for raw in jobs:
                normalize_and_ingest_job(raw)
                total_ingested += 1
        except Exception as e:
            logger.error(f"Error fetching from adapter {adapter.source_name}: {e}")
    return total_ingested
