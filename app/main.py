from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from app.auth import router as auth_router
from app.projects import router as projects_router
from app.issues import router as issues_router

app = FastAPI(title="Issue Tracker")

# ☁️ CORS setup:
origins = [
    "http://localhost:3000",
    # add other origins if needed (e.g. your production URL)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(issues_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
