"""
Seed data generator for demo mode and offline testing.
Populates 10 fake users, 20 fake resumes, 100 fake jobs, and 50 skills into db_store.
"""

import uuid
from app.db.memory_db import db_store, get_iso_now
from app.ml.embeddings.embedding_service import generate_embedding

MAJORS = ["Computer Science Engineering", "Robotics & Automation", "Artificial Intelligence & Data Science", "Mechanical Engineering", "Electrical Engineering", "Information Technology"]
CATEGORIES = ["SOFTWARE ENGINEERING", "FRONTEND", "BACKEND", "FULL STACK", "AI / ML", "DATA", "CLOUD / DEVOPS", "CYBERSECURITY", "ROBOTICS", "EMBEDDED", "MOBILE", "QA", "PRODUCT / TECHNICAL", "RESEARCH"]

def seed_demo_dataset():
    # 1. Seed Skills
    skills_list = [
        "Python", "JavaScript", "TypeScript", "C++", "Java", "Go", "Rust",
        "React", "Next.js", "Tailwind CSS", "Vue", "Angular",
        "FastAPI", "Node.js", "Express", "Django", "Flask",
        "PyTorch", "TensorFlow", "scikit-learn", "NLP", "Computer Vision", "LLM", "RAG", "pgvector",
        "ROS2", "Gazebo", "SLAM", "MoveIt", "OpenCV", "PCL",
        "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD",
        "PostgreSQL", "MongoDB", "Redis", "Elasticsearch",
        "Git", "REST APIs", "GraphQL", "Linux", "gRPC"
    ]
    for s in skills_list:
        if s not in db_store.skills_catalog:
            db_store.skills_catalog[s] = "General"

    # 2. Seed Jobs (100 jobs)
    job_templates = [
        ("Software Engineer - Backend & AI", "ScaleAI", "Build scalable backend APIs and vector search pipelines.", ["Python", "FastAPI", "PostgreSQL", "pgvector", "Docker"], "San Francisco, CA", "Hybrid", "Full-time"),
        ("Frontend Developer (React / Next.js)", "Vercel Labs", "Craft responsive frontend web experiences with Next.js & Tailwind.", ["React", "Next.js", "TypeScript", "Tailwind CSS"], "Remote", "Remote", "Full-time"),
        ("Autonomous Robotics Software Engineer", "Skydio", "Develop navigation, SLAM, and motion planning for autonomous drones.", ["C++", "ROS2", "Gazebo", "SLAM", "Python"], "San Mateo, CA", "Hybrid", "Full-time"),
        ("Machine Learning Engineer - LLMs & RAG", "Anthropic Labs", "Design RAG architectures and evaluate LLM performance.", ["Python", "PyTorch", "LLM", "RAG", "scikit-learn"], "San Francisco, CA", "Remote", "Full-time"),
        ("Full Stack Developer", "Stripe", "Build full stack payment dashboards and microservices.", ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs"], "Seattle, WA", "Hybrid", "Full-time"),
        ("Robotics Software Intern", "Boston Dynamics", "Implement ROS2 node controllers and sensor fusion.", ["C++", "ROS2", "Python", "Linux"], "Waltham, MA", "On-site", "Internship"),
        ("Data Engineer / Analytics", "Snowflake", "Build high-throughput data processing pipelines.", ["Python", "SQL", "PostgreSQL", "AWS"], "San Jose, CA", "Hybrid", "Full-time"),
        ("DevOps / Site Reliability Engineer", "Datadog", "Manage Kubernetes clusters and infrastructure automation.", ["Docker", "Kubernetes", "AWS", "Terraform", "Linux"], "New York, NY", "Remote", "Full-time"),
        ("Embedded Firmware Engineer", "Tesla", "Develop low-level C/C++ firmware for vehicle control systems.", ["C++", "Linux", "Embedded"], "Austin, TX", "On-site", "Full-time"),
        ("AI Research Intern", "DeepMind", "Assist with novel deep learning and reinforcement learning research.", ["Python", "PyTorch", "NLP", "LLM"], "London, UK", "Hybrid", "Internship")
    ]

    j_count = 0
    for idx in range(100):
        tmpl = job_templates[idx % len(job_templates)]
        j_id = f"job_demo_{idx+1}"
        title = f"{tmpl[0]} {'(Senior)' if idx % 3 == 0 else ''}".strip()
        comp = f"{tmpl[1]} {idx//10 + 1}"
        job_obj = {
            "id": j_id,
            "title": title,
            "company": comp,
            "description": f"{tmpl[2]} Opportunity to work with cutting-edge engineering tools and scalable architecture.",
            "skills": tmpl[3],
            "location": tmpl[4],
            "remote_type": tmpl[5],
            "employment_type": tmpl[6],
            "experience_required": "0-2 years" if idx % 2 == 0 else "2-4 years",
            "salary_min": 90000 + (idx * 500),
            "salary_max": 130000 + (idx * 600),
            "salary_currency": "USD",
            "source": CATEGORIES[idx % len(CATEGORIES)],
            "source_url": f"https://careers.example.com/job/{j_id}",
            "application_url": f"https://careers.example.com/job/{j_id}",
            "posted_at": get_iso_now(),
            "created_at": get_iso_now(),
            "updated_at": get_iso_now()
        }
        db_store.jobs[j_id] = job_obj
        text_repr = f"{job_obj['title']} {job_obj['company']} {job_obj['description']} {' '.join(job_obj['skills'])}"
        db_store.job_embeddings[j_id] = generate_embedding(text_repr)
        j_count += 1

    # 3. Seed Users & Resumes
    user_names = [
        ("Alex Rivers", "alex.dev@example.com", "Computer Science", ["Python", "FastAPI", "React", "PostgreSQL", "Docker"]),
        ("Samantha Chen", "samantha@example.com", "Robotics & Automation", ["C++", "ROS2", "Gazebo", "SLAM", "Python"]),
        ("Marcus Vance", "marcus@example.com", "Artificial Intelligence", ["Python", "PyTorch", "LLM", "scikit-learn", "NLP"]),
        ("Priya Sharma", "priya@example.com", "Computer Science Engineering", ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS"]),
        ("David Kim", "david@example.com", "Mechanical Engineering", ["Python", "ROS2", "C++", "Computer Vision"]),
        ("Elena Rostova", "elena@example.com", "Information Technology", ["Docker", "Kubernetes", "AWS", "Python", "Linux"]),
        ("Jordan Smith", "jordan@example.com", "Data Science", ["Python", "SQL", "scikit-learn", "PostgreSQL", "RAG"]),
        ("Liam Patel", "liam@example.com", "Electrical Engineering", ["C++", "Embedded", "ROS2", "Linux"]),
        ("Sophia Taylor", "sophia@example.com", "Computer Science", ["Java", "Spring Boot", "REST APIs", "AWS"]),
        ("Noah Williams", "noah@example.com", "Cybersecurity", ["Python", "Linux", "Security", "REST APIs"])
    ]

    for idx, (name, email, major, u_skills) in enumerate(user_names):
        u_id = f"demo_user_{idx+1}" if idx > 0 else "demo_user_123"
        db_store.profiles[u_id] = {
            "id": u_id,
            "auth_user_id": u_id,
            "full_name": name,
            "email": email,
            "phone": f"+1 (555) 019-{idx+10}",
            "city": "San Francisco",
            "country": "USA",
            "linkedin_url": f"https://linkedin.com/in/{name.lower().replace(' ', '')}",
            "github_url": f"https://github.com/{name.lower().replace(' ', '')}",
            "portfolio_url": f"https://{name.lower().replace(' ', '')}.dev",
            "show_outside_roles": True
        }
        db_store.education[u_id] = [{
            "institution": "State Tech University",
            "degree": "B.Tech",
            "major": major, # Major stored separately!
            "specialization": "Artificial Intelligence & Software Systems",
            "graduation_year": 2025,
            "gpa": 3.85
        }]
        db_store.job_preferences[u_id] = [
            {"job_title": "Software Engineer", "category": "SOFTWARE ENGINEERING", "priority": 1},
            {"job_title": "AI Engineer", "category": "AI / ML", "priority": 1},
            {"job_title": "Robotics Engineer", "category": "ROBOTICS", "priority": 2}
        ]

        # 2 Resumes per user (Total 20 resumes)
        for r_idx in range(2):
            r_id = f"demo_resume_{idx*2 + r_idx + 1}"
            r_name = f"{name} - {'Software & AI' if r_idx == 0 else 'Robotics & Systems'} Resume"
            struct_json = {
                "personal": {"full_name": name, "email": email, "phone": "+1 555 0192", "city": "San Francisco", "country": "USA"},
                "education": [{"institution": "State Tech University", "degree": "B.Tech", "major": major, "graduation_year": 2025, "gpa": 3.85}],
                "experience": [{
                    "company": "Innovation Labs",
                    "role": "Software Engineering Intern",
                    "start_date": "2024",
                    "end_date": "Present",
                    "bullet_points": [
                        f"Developed REST microservices in {u_skills[0]} and FastAPI handling 10,000+ API calls daily.",
                        "Optimized database query response times by 35% through indexing and caching."
                    ]
                }],
                "projects": [{
                    "title": f"AI Platform Project {r_idx+1}",
                    "technologies": u_skills,
                    "bullet_points": [f"Built end-to-end intelligent recommendation engine leveraging {u_skills[0]} and vector search."]
                }],
                "skills": {
                    "programming_languages": [s for s in u_skills if s in ["Python", "TypeScript", "C++", "Java"]],
                    "frameworks": [s for s in u_skills if s in ["FastAPI", "React", "Next.js"]],
                    "databases": ["PostgreSQL", "pgvector"],
                    "cloud": ["AWS", "Docker"],
                    "ai_ml": [s for s in u_skills if s in ["scikit-learn", "PyTorch", "LLM", "NLP", "RAG"]],
                    "robotics": [s for s in u_skills if s in ["ROS2", "Gazebo", "SLAM"]],
                    "tools": ["Git", "Linux"]
                },
                "certifications": ["AWS Certified Cloud Practitioner"],
                "achievements": ["Dean's Honor List"],
                "leadership": ["Tech Lead"],
                "publications": [],
                "links": []
            }
            db_store.resumes[r_id] = {
                "id": r_id,
                "user_id": u_id,
                "name": r_name,
                "target_role": "Software Engineer" if r_idx == 0 else "Robotics Software Engineer",
                "file_path": f"uploads/{r_id}_resume.pdf",
                "file_type": "pdf",
                "original_text": f"{name} {major} {' '.join(u_skills)} Developer Resume",
                "structured_json": struct_json,
                "resume_score": 86.0 + (r_idx * 3),
                "created_at": get_iso_now(),
                "updated_at": get_iso_now()
            }
            db_store.resume_embeddings[r_id] = generate_embedding(f"{name} {major} {' '.join(u_skills)}")

    return {
        "users": len(db_store.profiles),
        "resumes": len(db_store.resumes),
        "jobs": len(db_store.jobs),
        "skills": len(db_store.skills_catalog)
    }

seed_demo_dataset()
