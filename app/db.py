# app/db.py
import os
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv

# 1. Load environment vars from .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
from app.models import User, Project, Issue 
# 2. Create the SQLModel engine
#    - echo=True will print all SQL under the hood, useful for debugging
engine = create_engine(DATABASE_URL, echo=True)

def init_db() -> None:
    """
    Create all tables on application startup.
    """
    SQLModel.metadata.create_all(engine)
