import os

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "AI Resume Screener & Recommendation Platform"
        API_V1_STR: str = "/api/v1"
        SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://your-supabase-project.supabase.co")
        SUPABASE_KEY: str = os.getenv("SUPABASE_ANON_KEY", "your-supabase-anon-key")
        SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-supabase-service-role-key")
        DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        GEMINI_MODEL: str = "gemini-2.5-flash"
        EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
        COLD_START_THRESHOLD: int = 50
        UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    settings = Settings()
except Exception:
    class ManualSettings:
        PROJECT_NAME: str = "AI Resume Screener & Recommendation Platform"
        API_V1_STR: str = "/api/v1"
        SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://your-supabase-project.supabase.co")
        SUPABASE_KEY: str = os.getenv("SUPABASE_ANON_KEY", "your-supabase-anon-key")
        SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-supabase-service-role-key")
        DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        GEMINI_MODEL: str = "gemini-2.5-flash"
        EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
        COLD_START_THRESHOLD: int = 50
        UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    settings = ManualSettings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
