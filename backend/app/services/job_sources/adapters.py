from app.services.job_sources.base import BaseJobSourceAdapter
from typing import List, Dict, Any

class LinkedInAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "LinkedIn"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Software Engineer - AI & Backend",
                "company": "ScaleAI Inc.",
                "description": "Building high-performance API services, RAG pipelines, and model inference systems using FastAPI and Python.",
                "skills": ["Python", "FastAPI", "PostgreSQL", "PyTorch", "Docker"],
                "location": "San Francisco, CA",
                "remote_type": "Hybrid",
                "employment_type": "Full-time",
                "experience_required": "0-2 years",
                "salary_min": 110000,
                "salary_max": 140000,
                "source": "LinkedIn",
                "source_url": "https://www.linkedin.com/jobs/view/sample-1",
                "application_url": "https://www.linkedin.com/jobs/view/sample-1"
            }
        ]

class NaukriAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Naukri"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Full Stack Engineer (React + Python)",
                "company": "Infosys Innovation Labs",
                "description": "Looking for a full stack engineer skilled in React, Next.js, and FastAPI backend services.",
                "skills": ["React", "Next.js", "Python", "FastAPI", "TypeScript", "Tailwind CSS"],
                "location": "Bengaluru, India",
                "remote_type": "Hybrid",
                "employment_type": "Full-time",
                "experience_required": "1-3 years",
                "salary_min": 900000,
                "salary_max": 1500000,
                "salary_currency": "INR",
                "source": "Naukri",
                "source_url": "https://www.naukri.com/job-listings-sample-2",
                "application_url": "https://www.naukri.com/job-listings-sample-2"
            }
        ]

class IndeedAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Indeed"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Machine Learning Engineer",
                "company": "DeepData Systems",
                "description": "Develop and deploy tabular and NLP models using scikit-learn, SentenceTransformers, and PyTorch.",
                "skills": ["Python", "scikit-learn", "SentenceTransformers", "PyTorch", "pgvector"],
                "location": "Austin, TX",
                "remote_type": "Remote",
                "employment_type": "Full-time",
                "experience_required": "0-2 years",
                "salary_min": 115000,
                "salary_max": 145000,
                "source": "Indeed",
                "source_url": "https://www.indeed.com/viewjob?jk=sample-3",
                "application_url": "https://www.indeed.com/viewjob?jk=sample-3"
            }
        ]

class InstahyreAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Instahyre"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Backend Engineer (FastAPI & Microservices)",
                "company": "Razorpay",
                "description": "Design high-reliability payment routing backend APIs with Python, FastAPI, and PostgreSQL.",
                "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs"],
                "location": "Bengaluru, India",
                "remote_type": "On-site",
                "employment_type": "Full-time",
                "experience_required": "1-3 years",
                "source": "Instahyre",
                "source_url": "https://www.instahyre.com/job-sample-4",
                "application_url": "https://www.instahyre.com/job-sample-4"
            }
        ]

class HiristAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Hirist"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "AI Research Intern",
                "company": "AI Frontier Labs",
                "description": "Conduct experiments on LLM fine-tuning, RAG optimization, and prompt evaluation.",
                "skills": ["Python", "PyTorch", "LLM", "NLP", "RAG"],
                "location": "Hyderabad, India",
                "remote_type": "Remote",
                "employment_type": "Internship",
                "experience_required": "0 years",
                "source": "Hirist",
                "source_url": "https://www.hirist.com/j/sample-5",
                "application_url": "https://www.hirist.com/j/sample-5"
            }
        ]

class GreenhouseAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Greenhouse"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Robotics Software Engineer",
                "company": "Skydio",
                "description": "Develop navigation and perception algorithms using ROS2, C++, and Gazebo simulation.",
                "skills": ["C++", "Python", "ROS2", "Gazebo", "SLAM", "Navigation"],
                "location": "San Mateo, CA",
                "remote_type": "Hybrid",
                "employment_type": "Full-time",
                "experience_required": "0-2 years",
                "salary_min": 120000,
                "salary_max": 150000,
                "source": "Greenhouse",
                "source_url": "https://boards.greenhouse.io/skydio/jobs/sample-6",
                "application_url": "https://boards.greenhouse.io/skydio/jobs/sample-6"
            }
        ]

class LeverAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Lever"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Autonomous Robotics Engineer",
                "company": "Nuro",
                "description": "Design motion planning and control software for autonomous delivery vehicles.",
                "skills": ["C++", "ROS2", "MoveIt", "Python", "Robotics"],
                "location": "Mountain View, CA",
                "remote_type": "On-site",
                "employment_type": "Full-time",
                "experience_required": "1-3 years",
                "source": "Lever",
                "source_url": "https://jobs.lever.co/nuro/sample-7",
                "application_url": "https://jobs.lever.co/nuro/sample-7"
            }
        ]

class CompanyCareersAdapter(BaseJobSourceAdapter):
    @property
    def source_name(self) -> str:
        return "Company Career Page"

    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Data Engineer / Analytics Engineer",
                "company": "Stripe",
                "description": "Build high-scale data infrastructure and feature store pipelines.",
                "skills": ["Python", "SQL", "PostgreSQL", "Data Engineering", "AWS"],
                "location": "Remote, US",
                "remote_type": "Remote",
                "employment_type": "Full-time",
                "experience_required": "1-3 years",
                "source": "Company Career Page",
                "source_url": "https://stripe.com/jobs/sample-8",
                "application_url": "https://stripe.com/jobs/sample-8"
            }
        ]

ALL_JOB_ADAPTERS = [
    LinkedInAdapter(),
    NaukriAdapter(),
    IndeedAdapter(),
    InstahyreAdapter(),
    HiristAdapter(),
    GreenhouseAdapter(),
    LeverAdapter(),
    CompanyCareersAdapter()
]
