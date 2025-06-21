# app/issues.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel


class IssueUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None  # ideally validate 'open'|'closed'



from app.models import Issue, Project
from app.db import engine
from app.auth import get_current_user



router = APIRouter(
    prefix="/projects/{project_id}/issues",
    tags=["issues"],
    dependencies=[Depends(get_current_user)],
)

@router.get("/", response_model=List[Issue])
def read_issues(project_id: int, current_user=Depends(get_current_user)):
    """
    List all issues for a given project, if the user owns it.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
        issues = session.exec(
            select(Issue).where(Issue.project_id == project_id)
        ).all()
    return issues

@router.post("/", response_model=Issue, status_code=status.HTTP_201_CREATED)
def create_issue(
    project_id: int,
    *,
    title: str,
    status: str = "open",
    current_user=Depends(get_current_user)
):
    """
    Create a new issue under a project you own.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
        issue = Issue(title=title, status=status, project_id=project_id)
        session.add(issue)
        session.commit()
        session.refresh(issue)
    return issue

@router.patch("/{issue_id}", response_model=Issue)
def update_issue(
    project_id: int,
    issue_id: int,
    issue_in: IssueUpdate,
    current_user=Depends(get_current_user)
):
    """
    Update an issue’s title or status.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
        issue = session.get(Issue, issue_id)
        if not issue or issue.project_id != project_id:
            raise HTTPException(status_code=404, detail="Issue not found")
        if issue_in.title is not None:
            issue.title = issue_in.title
        if issue_in.status is not None:
            issue.status = issue_in.status
        session.add(issue)
        session.commit()
        session.refresh(issue)
    return issue

@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(
    project_id: int,
    issue_id: int,
    current_user=Depends(get_current_user)
):
    """
    Delete a specific issue.
    """
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Project not found")
        issue = session.get(Issue, issue_id)
        if not issue or issue.project_id != project_id:
            raise HTTPException(status_code=404, detail="Issue not found")
        session.delete(issue)
        session.commit()
    return None
