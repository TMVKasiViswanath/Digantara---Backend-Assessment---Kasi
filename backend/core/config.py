from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Scheduler Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    
    # APScheduler settings
    SCHEDULER_API_ENABLED: bool = True
    SCHEDULER_TIMEZONE: str = "UTC"
    
    # API settings
    API_TITLE: str = "Scheduler Service API"
    API_DESCRIPTION: str = "API for managing scheduled jobs"
    
    class Config:
        case_sensitive = True

settings = Settings() 