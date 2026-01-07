"""
project_models.py - SQLAlchemy Models for Project Persistence

Defines the Project model for storing ROI calculator projects.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON
from database import Base


class Project(Base):
    """SQLAlchemy model for saved ROI projects."""
    
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, default="Untitled Project")
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    inputs = Column(JSON, nullable=False, default={})
    results = Column(JSON, nullable=False, default={})
    scenarios = Column(JSON, nullable=False, default={})
    
    def to_dict(self):
        """Convert to dictionary for JSON response."""
        return {
            "id": self.id,
            "name": self.name,
            "created": self.created.isoformat() if self.created else None,
            "updated": self.updated.isoformat() if self.updated else None,
            "inputs": self.inputs or {},
            "results": self.results or {},
            "scenarios": self.scenarios or {},
        }
