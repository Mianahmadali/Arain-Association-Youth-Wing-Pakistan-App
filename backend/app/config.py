from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "arain_association")
    
    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # OpenRouter API
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    ai_model: str = os.getenv("AI_MODEL", "anthropic/claude-3-haiku")
    
    # Application
    app_name: str = os.getenv("APP_NAME", "Arain Association Youth Wing Pakistan")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    
    @property
    def origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    # File Upload
    max_file_size: int = int(os.getenv("MAX_FILE_SIZE", "5242880"))  # 5MB
    upload_dir: str = os.getenv("UPLOAD_DIR", "uploads/profile_images")
    
    # Admin
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@arainyouthwing.org")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "admin123")
    
    class Config:
        env_file = ".env"

settings = Settings()
