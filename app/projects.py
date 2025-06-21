# app/projects.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel

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
def delete_project(
    project_id: int,
    current_user=Depends(get_current_user)
):
    """
    Delete a project only if all its issues are closed or none exist.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
        # Check for any open issues
        open_issues = session.exec(
            select(Issue).where(
                Issue.project_id == project_id,
                Issue.status != "closed"
            )
        ).all()
        if open_issues:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete project with open issues"
            )
        session.delete(project)
        session.commit()
    return None
