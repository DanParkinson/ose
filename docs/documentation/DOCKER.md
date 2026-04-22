## Docker Setup

The project uses **Docker Compose** to run the backend, frontend, PostgreSQL database, and Redis cache in separate containers.
This creates a consistent local development environment and avoids machine-specific setup issues.

---

## Table of Contents

- [Services Overview](#services-overview)
- [Environment Variables](#environment-variables)
- [Docker Compose Configuration](#docker-compose-configuration)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
  - [Redis](#redis)
- [Docker Volumes](#docker-volumes)
- [Dev Container Configuration](#dev-container-configuration)
  - [Included VS Code Extensions](#included-vs-code-extensions)
- [Backend Dockerfile](#backend-dockerfile)
- [Frontend Dockerfile](#frontend-dockerfile)
- [Container Startup Notes](#container-startup-notes)
- [Summary](#summary)

---

### Services Overview

| Service     | Description |
| ----------- | ----------- |
| `backend`   | Runs the Django backend inside a Python 3.12 container. |
| `frontend`  | Runs the frontend inside a Node 20 container using the Vite development server. |
| `db`        | Runs a PostgreSQL 17 database container for persistent application data. |
| `redis`     | Runs a Redis 7 container for caching. |

---

### Environment Variables

The database container uses the following environment variables:

```env
POSTGRES_DB=dev_database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
```

These values are loaded through the `.env` file referenced in the Docker Compose configuration.

---

### Docker Compose Configuration

The project uses a `docker-compose.yml` file to define and connect all services.

#### Backend
- Built from the project root using `backend/Dockerfile.backend`
- Exposes port `8000`
- Mounts the full project into `/app`
- Waits for PostgreSQL and Redis before starting
- Uses environment variables from `.env`

#### Frontend
- Built from the project root using `frontend/Dockerfile.frontend`
- Exposes port `5173`
- Mounts the frontend source code into the container
- Enables polling for file watching in development

#### Database
- Uses the official `postgres:17` image
- Stores persistent data in a named Docker volume
- Includes a health check using `pg_isready`

#### Redis
- Uses the official `redis:7` image
- Stores Redis data in a named Docker volume

---

### Docker Volumes

| Volume         | Description |
| -------------- | ----------- |
| `postgres_db`  | Stores PostgreSQL database data persistently. |
| `redis_data`   | Stores Redis data persistently. |

---

### Dev Container Configuration

The project also includes a **Dev Container** setup for development inside VS Code.

The dev container:

- Uses `docker-compose.yml`
- Connects to the `backend` service
- Sets the workspace folder to `/app`
- Enables Docker-outside-of-Docker support
- Configures the Python interpreter at `/app/backend/.venv/bin/python`

#### Included VS Code Extensions
- Python
- Pylance
- Jupyter
- Ruff
- REST Client
- AutoDocstring

This setup helps standardise the development environment across different machines.

---

### Backend Dockerfile

The backend container is based on `python:3.12-slim-bookworm`.

It:

- Sets `/app` as the working directory
- Installs system dependencies such as `git`, `curl`, `libpq-dev`, and `build-essential`
- Installs `uv`
- Copies `pyproject.toml` and `uv.lock`
- Runs `uv sync --frozen` to install dependencies
- Copies the full project into the container
- Makes `entrypoint.sh` executable
- Exposes port `8000`

The backend starts using:

```dockerfile
ENTRYPOINT ["sh", "/app/backend/entrypoint.sh"]
```

---

### Frontend Dockerfile

The frontend container is based on `node:20-bookworm-slim`.

It:

- Sets `/app/frontend` as the working directory
- Copies `package.json` files first for caching
- Exposes port `5173`
- Starts the Vite development server with host binding enabled

The frontend starts using:

```dockerfile
CMD ["sh", "-c", "npm install && npm run dev -- --host"]
```

---

### Container Startup Notes

- The backend depends on the database being healthy before it starts
- The backend also depends on Redis being available
- The backend currently uses `sleep infinity` in Docker Compose, which is useful for Dev Container development
- PostgreSQL and Redis use named volumes so their data persists between container restarts

---

### Summary

Docker is used in this project to:

- standardise the development environment
- isolate backend, frontend, database, and cache services
- simplify onboarding and local setup
- support development inside VS Code Dev Containers

---
