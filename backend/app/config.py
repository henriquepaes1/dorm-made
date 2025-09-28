from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "Dorm-Made API"
    version: str = "1.0.0"
    debug: bool = False
    
    # Database
    database_url: str = "postgresql://dorm_user:dorm_password@db:5432/dorm_made"
    
    # Security
    secret_key: str = "your-super-secret-key-change-this-in-production-make-it-very-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:8080", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
