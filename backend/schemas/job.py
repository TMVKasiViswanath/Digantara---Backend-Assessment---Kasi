from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class JobBase(BaseModel):
    name: str
    description: Optional[str] = None
    job_type: str
    schedule_type: str
    schedule_config: Dict[str, Any]
    parameters: Optional[Dict[str, Any]] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    schedule_config: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None

class JobInDB(JobBase):
    id: int
    is_active: bool
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    status: str
    error_message: Optional[str] = None

    class Config:
        from_attributes = True

class JobResponse(JobInDB):
    pass 