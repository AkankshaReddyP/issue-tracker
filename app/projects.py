# app/projects.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlmodel import Session, select, delete
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import text
import logging

class ProjectUpdate(BaseModel):
    name: Optional[str] = None


from app.models import Project, Issue
from app.db import engine
from app.auth import get_current_user

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)



@router.get("/", response_model=List[Project])
def read_projects(current_user=Depends(get_current_user)):
    """
    List all projects owned by the authenticated user.
    """
    with Session(engine) as session:
        projects = session.exec(
            select(Project).where(Project.owner_id == current_user.id)
        ).all()
    return projects

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(*, name: str, current_user=Depends(get_current_user)):
    """
    Create a new project under the authenticated user.
    """
    project = Project(name=name, owner_id=current_user.id)
    with Session(engine) as session:
        session.add(project)
        session.commit()
        session.refresh(project)
    return project

@router.get("/{project_id}", response_model=Project)
def read_project(project_id: int, current_user=Depends(get_current_user)):
    """
    Fetch a single project by ID, if owned by the authenticated user.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.patch("/{project_id}", response_model=Project)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    current_user=Depends(get_current_user)
):
    """
    Update a project’s name.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
        if project_in.name is not None:
            project.name = project_in.name
        session.add(project)
        session.commit()
        session.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        # Validate ownership
        proj = session.get(Project, project_id)
        if not proj or proj.owner_id != current_user.id:
            raise HTTPException(404, "Project not found")
        # Block if any open issues remain
        open_issues = session.exec(
            select(Issue).where(
                Issue.project_id == project_id,
                Issue.status == "open"
            )
        ).all()
        if open_issues:
            raise HTTPException(400, "Cannot delete project with open issues")

        # ORM way: first delete all issues for the project
        session.exec(delete(Issue).where(Issue.project_id == project_id))
        session.commit()

        # Now delete the project
        session.exec(delete(Project).where(Project.id == project_id))
        session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
