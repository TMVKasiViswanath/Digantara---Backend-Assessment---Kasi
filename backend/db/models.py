from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    job_type = Column(String)  # e.g., "email", "calculation", etc.
    schedule_type = Column(String)  # e.g., "interval", "cron", "date"
    schedule_config = Column(JSON)  # Store schedule configuration as JSON
    is_active = Column(Boolean, default=True)
    last_run = Column(DateTime, nullable=True)
    next_run = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    parameters = Column(JSON, nullable=True)  # Additional job parameters
    status = Column(String, default="pending")  # pending, running, completed, failed
    error_message = Column(String, nullable=True) 