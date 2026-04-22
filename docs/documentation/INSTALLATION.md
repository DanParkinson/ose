## Installation Guide

This project uses **Docker**, **Docker Compose**, and **VS Code Dev Containers** to create a consistent development environment for the backend, frontend, PostgreSQL database, and Redis cache.

The steps below explain how to set up the project for local development.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Environment Variables](#environment-variables)
- [Open the Project in VS Code](#open-the-project-in-vs-code)
- [Start the Development Container](#start-the-development-container)
- [Services Included in the Development Environment](#services-included-in-the-development-environment)
- [Backend Environment](#backend-environment)
- [Frontend Environment](#frontend-environment)
- [Running the Project](#running-the-project)
- [Database Setup](#database-setup)
- [Accessing the Application](#accessing-the-application)
- [Stopping the Environment](#stopping-the-environment)
- [Notes](#notes)

---

### Prerequisites

Before starting, make sure the following tools are installed:

- **Docker**
- **Docker Compose**
- **Visual Studio Code**
- **Dev Containers extension for VS Code**
- **Git**

---

### Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

---

### Environment Variables

Create a `.env` file in the same directory as your `docker-compose.yml` file.

Add the following values:

```env
POSTGRES_DB=dev_database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
```

These environment variables are used by the PostgreSQL container and by the backend service when connecting to the database.

---

### Open the Project in VS Code

Open the project folder in **Visual Studio Code**.

If the Dev Containers extension is installed, VS Code should detect the container configuration automatically.

---

### Start the Development Container

Open the Command Palette in VS Code and select:

```text
Dev Containers: Reopen in Container
```

This will:

- build the Docker containers
- start the backend, frontend, PostgreSQL, and Redis services
- open the project inside the configured development container

The workspace will open at:

```text
/app
```

---

### Services Included in the Development Environment

The development setup starts the following containers:

| Service     | Description |
| ----------- | ----------- |
| `backend`   | Django backend application |
| `frontend`  | Frontend development server |
| `db`        | PostgreSQL database |
| `redis`     | Redis cache |

---

### Backend Environment

The backend container:

- uses **Python 3.12**
- installs dependencies using **uv**
- uses the interpreter located at:

```text
/app/backend/.venv/bin/python
```

Dependencies are installed during the image build process using:

```bash
uv sync --frozen
```

---

### Frontend Environment

The frontend container:

- uses **Node 20**
- runs the frontend development server on port `5173`

---

### Running the Project

Once the dev container is open, the containers should already be available through Docker Compose.

The project exposes the following ports:

| Service    | Port |
| ---------- | ---- |
| Backend    | `8000` |
| Frontend   | `5173` |
| PostgreSQL | `5432` internally |
| Redis      | default internal Redis port |

Depending on your setup, you may need to start the Django development server manually inside the backend container if it is not already running.

Example:

```bash
cd /app/backend
python uv run manage.py runserver 0.0.0.0:8000
```

---

### Database Setup

If this is the first time running the project, apply migrations from inside the backend container:

```bash
cd /app/backend
python uv run manage.py migrate
```

If needed, create a superuser:

```bash
python uv run manage.py createsuperuser
```

---

### Accessing the Application

Once running, the project should be available at:

| Service   | URL |
| --------- | --- |
| Backend   | `http://localhost:8000/` |
| Frontend  | `http://localhost:5173/` |

---

### Stopping the Environment

To stop the containers, shut down the Dev Container session or stop the Docker Compose services from Docker Desktop or the terminal.

---

### Notes

- PostgreSQL data is stored in a named Docker volume
- Redis data is stored in a named Docker volume
- The backend service depends on the database being healthy before startup
- The development container is designed to keep the environment consistent across machines

---
