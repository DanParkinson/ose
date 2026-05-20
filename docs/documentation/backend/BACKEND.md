# Open-Source Education Backend

## Navigation

[← Back to README.md](/README.md)

## Introduction

**Open-Source Education's** backend is built using Django and Django REST Framework.

It provides the API layer used by the frontend application.

It currently supports:

- Django REST Framework API endpoints
- JWT cookie authentication
- Core educational content management
- Filtering and search workflows
- Pagination for reusable frontend lists
- Account lifecycle management
- Backend API testing

## Key Features

| Feature | Description |
|---|---|
| **Django Backend** | Main backend application built using Django. |
| **Django REST Framework API** | API endpoints used by the frontend application. |
| **JWT Authentication** | Cookie-based JWT authentication using dj-rest-auth and SimpleJWT. |
| **Core Educational Models** | Educational content structure for subjects, lessons, resources, and lesson variants. |
| **Filtering and Search** | Reusable API filtering and search support. |
| **Pagination** | Limit-offset pagination for reusable frontend workflows. |
| **Testing** | Backend testing for permissions, API behaviour, validation, and data handling. |

# Supporting Documentation

## Architecture

### API

| Documentation | Description |
|---|---|
| [API Architecture](./architecture/api/API_ARCHITECTURE.md) | High-level backend API structure and architectural conventions. |
| [Filtering and Search](./architecture/api/FILTERING_AND_SEARCH.md) | Backend filtering and search conventions for reusable API views. |
| [Pagination](./architecture/api/PAGINATION.md) | Pagination architecture and reusable paginated response structure. |

### API Endpoints

| Documentation | Description |
|---|---|
| [Authentication Endpoints](./architecture/api/endpoints/AUTHENTICATION.md) | Authentication-related API endpoints and workflows. |
| [Core Endpoints](./architecture/api/endpoints/CORE.md) | Core educational API endpoints and resource structure. |

### API Serializers

| Documentation | Description |
|---|---|
| [List Create Serializers](./architecture/api/serializers/LIST_CREATE_SERIALIZERS.md) | Standard serializer conventions for reusable list/create API workflows. |

### API Views

| Documentation | Description |
|---|---|
| [List Create Views](./architecture/api/views/LIST_CREATE_VIEWS.md) | Standard DRF list/create view conventions and reusable patterns. |


### Apps

#### Accounts

| Documentation | Description |
|---|---|
| [Accounts App](./architecture/apps/ACCOUNTS_APP.md) | High-level overview of the accounts application responsibilities and architecture. |
| [Core App](./architecture/apps/CORE_APP.md) | High-level overview of the educational content system and core application structure. |


## Authentication

| Documentation | Description |
|---|---|
| [Authentication](./architecture/authentication/AUTHENTICATION.md) | JWT authentication architecture and backend authentication workflows. |
| [Registration](./architecture/authentication/REGISTRATION.md) | Email-first registration architecture and account creation workflows. |
| [User Serializers](./architecture/authentication/USER_SERIALIZERS.md) | Custom authentication serializers and frontend authentication state structure. |
| [Frontend Authentication](./architecture/authentication/FRONTEND_AUTHENTICATION.md) | Frontend and backend authentication integration using JWT cookies, CORS, and CSRF configuration. |
| [Email Configuration](./architecture/authentication/EMAILs.md) | Development and production email backend configuration and authentication email workflows. |
| [Custom User Model](./architecture/authentication/CUSTOM_USER_MODEL.md) | Email-based custom user model and authentication identity configuration. |

## Infrastructure

| Documentation | Description |
|---|---|
| [API Tooling](./infrastructure/API_TOOLING.md) | DRF ecosystem tooling, authentication packages, filtering, and schema generation. |
| [Caching](./infrastructure/CACHING.md) | Backend caching configuration and Redis integration. |
| [CSRF Configuration](./infrastructure/CSRF.md) | CSRF protection and trusted frontend origin configuration. |

## Features
| Documentation | Description |
|---|---|
| [Account Deactivation](./feature/ACCOUNT_DEACTIVATION.md) | Account deactivation system |

## Config

| Documentation | Description |
|---|---|
| [Dependencies](./config/DEPENDENCIES.md) | Backend frameworks, libraries, and supporting dependencies. |


## Testing

| Documentation | Description |
|---|---|
| [Testing Checklist](./testing/TESTING_CHECKLIST.md) | Checklist used to track backend API testing coverage and workflows. |
| [Testing Overview](./testing/TESTING_OVERVIEW.md) | High-level overview of backend testing structure and conventions. |
