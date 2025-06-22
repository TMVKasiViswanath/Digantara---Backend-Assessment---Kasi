from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from datetime import datetime
from typing import Dict, Any, Optional
import logging
from sqlalchemy.orm import Session
from backend.db.models import Job
from backend.core.config import settings

logger = logging.getLogger(__name__)

class SchedulerService:
    def __init__(self):
        self.scheduler = BackgroundScheduler(
            timezone=settings.SCHEDULER_TIMEZONE,
            job_defaults={'coalesce': True, 'max_instances': 1}
        )
        self.scheduler.start()

    def create_trigger(self, schedule_type: str, schedule_config: Dict[str, Any]):
        if schedule_type == "interval":
            return IntervalTrigger(**schedule_config)
        elif schedule_type == "cron":
            return CronTrigger(**schedule_config)
        elif schedule_type == "date":
            return DateTrigger(**schedule_config)
        else:
            raise ValueError(f"Unsupported schedule type: {schedule_type}")

    def add_job(self, db: Session, job: Job):
        try:
            trigger = self.create_trigger(job.schedule_type, job.schedule_config)
            
            # Add job to scheduler
            self.scheduler.add_job(
                self.execute_job,
                trigger=trigger,
                args=[db, job.id],
                id=str(job.id),
                replace_existing=True
            )
            
            # Update next run time
            job.next_run = self.scheduler.get_job(str(job.id)).next_run_time
            db.commit()
            
            return True
        except Exception as e:
            logger.error(f"Error adding job {job.id}: {str(e)}")
            return False

    def remove_job(self, job_id: int):
        try:
            self.scheduler.remove_job(str(job_id))
            return True
        except Exception as e:
            logger.error(f"Error removing job {job_id}: {str(e)}")
            return False

    def execute_job(self, db: Session, job_id: int):
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            logger.error(f"Job {job_id} not found")
            return

        try:
            job.status = "running"
            job.last_run = datetime.utcnow()
            db.commit()

            # Execute job based on type
            if job.job_type == "email":
                self._execute_email_job(job)
            elif job.job_type == "calculation":
                self._execute_calculation_job(job)
            else:
                raise ValueError(f"Unsupported job type: {job.job_type}")

            job.status = "completed"
            job.error_message = None
        except Exception as e:
            job.status = "failed"
            job.error_message = str(e)
            logger.error(f"Error executing job {job_id}: {str(e)}")
        finally:
            db.commit()

    def _execute_email_job(self, job: Job):
        # Dummy email sending logic
        logger.info(f"Sending email with parameters: {job.parameters}")

    def _execute_calculation_job(self, job: Job):
        # Dummy calculation logic
        logger.info(f"Performing calculation with parameters: {job.parameters}")

scheduler_service = SchedulerService() 