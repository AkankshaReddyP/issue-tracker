from fastapi import FastAPI
from app.db import init_db
from app.auth import router as auth_router
from app.projects import router as projects_router
from app.issues import router as issues_router

app = FastAPI(title="Issue Tracker")

@app.on_event("startup")
def on_startup():
    init_db()

# later: include your routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(issues_router)
