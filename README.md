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
git clone https://github.com/AkankshaReddyP/issue-tracker
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

##### Design Decisions

The structure behind this app is a classic relational data model that fits for a typical issue tracker. Every user gets their own corner of the app, with as many projects as they need, and each project branches out into a set of issues. This approach keeps everyone’s work siloed, so users aren’t tripping over each other’s tasks—projects and their associated issues remain private and secure, tied directly to whoever owns them. On the technical side, the database design uses normalized schemas, complete with unique identifiers and foreign keys.It helps in scaling up later and makes permissions a whole lot easier.


###### Authentication Approach

When it comes to logging in, the system relies on JWT tokens for authentication—a choice that’s become fairly standard these days. Once a user signs in, the backend hands over a signed token, which the frontend then tucks away in its localstorage and attaches to any request that needs protection (via the Authorization: Bearer header). Except for signup and login, every API call expects a valid token, and the backend checks it each time. This way, only the rightful owner can peek into their data. All passwords are securely hashed before they’re stored anywhere, so even if someone got their hands on the database, user credentials would still be protected.

###### Future Expansion

Looking ahead, there’s plenty of room to grow. The system could easily evolve to support more collaborative features—for instance, tracking who reported or created an issue by adding more details in UI, or letting multiple users assign themselves or “watch” an issue through extra fields or linking tables. Introducing roles like ADMIN could open up organization-wide management, letting certain users oversee everything from projects to individual issues. To make things more versatile, the app might eventually support private, public, or shared projects, giving teams or even outside contributors the right level of access. And for those moments when words just aren’t enough, allowing users to upload screenshots or documents would make it much easier to communicate and keep everyone on the same page.




