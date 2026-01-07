"""
database.py - SQLite Database Setup

Uses SQLAlchemy for ORM and SQLite for simple file-based storage.
Database file persists across Railway deployments via volumes.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import contextmanager

# Database URL - use environment variable or default to local file
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./projects.db")

# Create engine (check_same_thread=False needed for SQLite with FastAPI)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def init_db():
    """Create all tables. Call this on startup."""
    Base.metadata.create_all(bind=engine)


@contextmanager
def get_db():
    """Get a database session. Use as context manager."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db_session():
    """Dependency for FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
