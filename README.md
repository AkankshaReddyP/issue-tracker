# Issue Tracker

A modern, full-stack issue tracking application built with **FastAPI** (backend),**SQLite** (database), **React + TailwindCSS** (frontend), and secure JWT authentication.

---

## 🚀 Features

- User sign up & login (JWT authentication)
- Secure per-user projects and issues
- CRUD for projects and issues
- User friendly UI
- RESTful API, easy to test via Postman

---

## 🛠️ Setup Instructions

### Prerequisites

- **Python** 3.9 or newer
- **Node.js** 18 or newer & npm
- (Optional) [Postman](https://www.postman.com/) for API testing

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/issue-tracker.git
cd issue-tracker
 
```
### 2. Backend setup

```bash

# (Optional) Create and activate a virtual environment
python -m venv .venv
# On Windows:
 .\.venv\Scripts\Activate.ps1
# On Mac/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server within a virtual environment
python -m uvicorn app.main:app --reload
```
The API will be available at: http://127.0.0.1:8000

### 3. Frontend Setup (React + TailwindCSS)

```bash
cd issue-tracker-frontend 

# Install dependencies
npm install

# Start the React app
npm start
 
```
The app will be available at: http://localhost:3000

### 4. Using the Postman Collection
#### 1. To Import:
Download the included Postman collection file - Issue tracker dev.postman_collection

In Postman, click Import (top left) > Upload Files, and select the JSON file

Or use the shared public Postman link :
(https://gold-station-17677.postman.co/workspace/My-Workspace~7196f926-f475-4de7-8edd-fa960e3c311f/collection/42346591-fb8e773a-53ee-4efe-9d8f-b18c5e722ad9?action=share&creator=42346591&active-environment=42346591-a5fa7d3e-d1e9-4689-a449-cd2b634a3c0e)

#### 2. To Test Authenticated Endpoints:
Use /signup to create a user, then /login to obtain a JWT token

For endpoints requiring authentication, add the token to the Authorization header:
Bearer <your-access-token>

## 📋 API Endpoints Summary

| Endpoint                                              | Method | Params/Where to Add            | Auth Required | Description                        |
| ----------------------------------------------------- | ------ | ------------------------------ | ------------- | ---------------------------------- |
| `/signup`                                             | POST   | `email`, `password` in query   | No            | Register a new user                |
| `/login`                                              | POST   | `username`, `password` in body (form) | No    | Obtain JWT access token            |
| `/projects/`                                          | GET    | -                              | Yes           | List all user projects             |
| `/projects/`                                          | POST   | `name` in query                | Yes           | Create a new project               |
| `/projects/{project_id}`                              | GET    | `project_id` in path           | Yes           | Get details for a single project   |
| `/projects/{project_id}`                              | PATCH  | `project_id` in path,<br>`name` in body (JSON) | Yes | Update a project's name            |
| `/projects/{project_id}`                              | DELETE | `project_id` in path           | Yes           | Delete a project                   |
| `/projects/{project_id}/issues/`                      | GET    | `project_id` in path           | Yes           | List all issues in a project       |
| `/projects/{project_id}/issues/`                      | POST   | `project_id` in path,<br>`title`, `status` in query | Yes | Create a new issue in a project    |
| `/projects/{project_id}/issues/{issue_id}`            | PATCH  | `project_id`, `issue_id` in path,<br>`status` in body (JSON) | Yes | Update an issue's status           |
| `/projects/{project_id}/issues/{issue_id}`            | DELETE | `project_id`, `issue_id` in path | Yes         | Delete an issue                    |

---

### 🔑 Authentication

All endpoints except `/signup` and `/login` require a JWT in the header:


A project cannot be deleted if it contains any open issues. All issues must be closed or deleted before deleting the project.


