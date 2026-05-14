# Frameworks, Libraries & Dependencies

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Core Backend Frameworks](#core-backend-frameworks)
- [Authentication & Security](#authentication--security)
- [Authentication Extensions](#authentication-extensions)
- [Filtering & API Utilities](#filtering--api-utilities)
- [Database & Caching](#database--caching)
- [Development & Debugging Tools](#development--debugging-tools)
- [Cross-Origin & Middleware](#cross-origin--middleware)
- [Testing Tools](#testing-tools)
- [Development Dependencies](#development-dependencies)
- [Dependency Philosophy](#dependency-philosophy)

## Purpose

Various third-party frameworks, libraries, and development tools are used throughout the backend to support:

```text
API development
authentication
database integration
filtering
caching
performance optimisation
schema generation
testing
infrastructure management
```

This document provides an overview of the major backend dependencies currently used throughout the platform.

## Core Backend Frameworks

| Library                         | Version | Description                        | Documentation                          |
|---------------------------------|---------|------------------------------------|----------------------------------------|
| **Django**                      | 5.2.12  | High-level Python web framework. | https://docs.djangoproject.com/          |
| **Django REST Framework (DRF)** | 3.17.1  | Toolkit for building RESTful APIs. | https://www.django-rest-framework.org/ |

## Authentication & Security

| Library                           | Version | Description                      | Documentation |
|-----------------------------------|---------|----------------------------------|---------------|
| **djangorestframework-simplejwt** | 5.5.1   | JWT authentication for DRF APIs. | https://django-rest-framework-simplejwt.readthedocs.io/en/latest/ |

## Authentication Extensions

| Library             | Version | Description                                    | Documentation |
|---------------------|---------|------------------------------------------------|---|
| **dj-rest-auth**    | 7.0.1   | Authentication endpoints and JWT integration.  | https://dj-rest-auth.readthedocs.io/ |
| **django-allauth**  | 65.11.2 | Account management and registration workflows. | https://docs.allauth.org/en/latest/ |

## Filtering & API Utilities

| Library             | Version | Description                                      | Documentation |
|---------------------|---------|--------------------------------------------------|---------------|
| **django-filter**   | 25.2    | Enables filtering for API querysets.             | https://django-filter.readthedocs.io/en/stable/ |
| **drf-spectacular** | 0.29.0  | OpenAPI schema generation and API documentation. | https://drf-spectacular.readthedocs.io/en/latest/ |

## Database & Caching

| Library             | Version | Description                                  | Documentation |
|---------------------|---------|----------------------------------------------|---|
| **psycopg**         | 3.3.3   | PostgreSQL database adapter for Python.      | https://www.psycopg.org/psycopg3/docs/ |
| **django-redis**    | 6.0.0   | Redis integration for caching.               |  https://github.com/jazzband/django-redis |
| **redis[hiredis]**  | 7.4.0   | Redis client with performance optimisations. | https://redis.readthedocs.io/en/stable/ |

## Development & Debugging Tools

| Library               | Version  | Description                                   | Documentation |
|-----------------------|----------|-----------------------------------------------|---|
| **django-extensions** | 4.1      | Additional management commands and utilities. | https://django-extensions.readthedocs.io/en/latest/ |
| **django-silk**       | 5.5.0    | Profiling and performance monitoring tool.    | https://github.com/jazzband/django-silk |
| **django-summernote** | 0.8.20.0 | WYSIWYG editor for content management.        | https://github.com/summernote/django-summernote |

## Cross-Origin & Middleware

| Library                 | Version | Description                                   | Documentation |
|-------------------------|---------|-----------------------------------------------|---|
| **django-cors-headers** | 4.9.0   | Handles Cross-Origin Resource Sharing (CORS). | https://github.com/adamchainz/django-cors-headers |

## Testing Tools

| Tool | Purpose |
|---|---|
| Django TestCase | Backend testing framework |
| DRF APIClient | API endpoint testing |
| unittest.mock | Mocking and signal testing |

## Development Dependencies

| Library | Version | Description | Documentation |
|---|---|---|---|
| **pre-commit** | 4.5.1 | Manages Git pre-commit hooks. | https://pre-commit.com/ |
| **ruff** | 0.5.0 | Fast Python linter and formatter. | https://docs.astral.sh/ruff/ |

## Dependency Philosophy

The backend dependency stack is designed around:

```text
reusable tooling
minimal custom infrastructure
DRF-first development
predictable authentication workflows
maintainable API architecture
performance optimisation
```

The platform prioritises widely adopted Django ecosystem tooling before introducing highly custom implementations.
