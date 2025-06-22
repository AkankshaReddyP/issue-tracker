from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, ForeignKey, Integer
from sqlmodel import Field, SQLModel, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(sa_column_kwargs={"unique": True, "nullable": False})
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # back-reference
    projects: List["Project"] = Relationship(back_populates="owner")


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id", nullable=False, index=True)
    name: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # relationships
    owner: User = Relationship(back_populates="projects")
    issues: List["Issue"] = Relationship(back_populates="project")


class Issue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("project.id", ondelete="CASCADE"))
    )
    title: str = Field(nullable=False)
    status: str = Field(
        default="open",
        sa_column_kwargs={
            "nullable": False,
            "check_constraint": "status IN ('open','closed')"
        }
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # back-reference
    project: Project = Relationship(back_populates="issues")
