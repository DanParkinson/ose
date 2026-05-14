# Open-Source Education Frontend

## Navigation

[← Back to README.md](/README.md)

## Introduction

**Open-Source Education's** frontend is designed to work with its Django REST Framework API.

It supports:

- Authentication through JWT cookie authentication
- Reusable dashboard components
- Admin management of core educational models
- Search, filtering, and pagination for dashboard data
- A shared theme and design system using Chakra UI

## Key Features

| Feature | Description |
|---|---|
| **User Authentication** | Secure user registration, login, logout, and cookie-based authentication. |
| **Admin Dashboard** | Admin dashboard for managing core educational models. |
| **Search and Filtering** | Dashboard data can be searched and filtered using reusable logic. |
| **Pagination** | Dashboard data uses offset-based pagination. |
| **Reusable Components** | Shared dashboard, form, layout, and UI components reduce duplication. |
| **Theme System** | Chakra theme tokens keep styling consistent across the application. |

# Supporting Documentation

# Infrastructure

| Documentation | Description |
|---|---|
| [Axios](./infrastructure/Axios.md) | Shared Axios configuration and frontend request setup. |
| [Dependencies](./infrastructure/DEPENDENCIES.md) | Frontend libraries, frameworks, and supporting dependencies. |

# Architecture

## API

| Documentation | Description |
|---|---|
| [Core API](./architecture/api/CORE_API.md) | Core API helper functions for reusable model fetching. |
| [useCoreModelData](./architecture/api/USE_CORE_MODEL_DATA.md) | Reusable hook for dashboard model fetching, pagination, and filtering. |
| [Form Meta Data Hooks](./architecture/api/FORM_METADATA_HOOKS.md) | Hooks supporting form dynamic generation. |

## Authentication

| Documentation | Description |
|---|---|
| [AuthContext](./architecture/authentication/AuthContext.md) | Global authentication provider and shared authentication logic. |

## Forms

| Documentation | Description |
|---|---|
| [Form Fields](./architecture/forms/FORM_FIELDS.md) | Reusable form components for CRUD operations|

## Filters

| Documentation | Description |
|---|---|
| [Filter Options](./architecture/filters/FILTER_OPTIONS.md) | Reusable filter option rendering and filter configuration structure. |
| [Text Search Filter](./architecture/filters/TEXT_SEARCH_FILTER.md) | Reusable dashboard text search orchestration and search state behaviour. |

## Model Management

| Documentation | Description |
|---|---|
| [Core Models](./architecture/model_management/CORE_MODELS.md) | Configuration structure for reusable dashboard models. |

## Pagination

| Documentation | Description |
|---|---|
| [Pagination](./architecture/pagination/PAGINATION.md) | Offset pagination orchestration and reusable pagination behaviour. |

## Renderers

| Documentation | Description |
|---|---|
| [Model Field Renderers](./architecture/renderers/MODEL_FIELD_RENDERERS.md) | Shared dashboard field rendering logic for booleans, arrays, and text values. |
| [Form Field Renderer](./architecture/renderers/FORM_FIELD_RENDERER.md) | Dynamic form renderer base on field metadata provided |

## Workflows

| Documentation | Description |
|---|---|
| [Admin Dashboard Workflow](./architecture/workflows/ADMIN_DASHBOARD.md) | Main admin dashboard orchestration and state management workflow. |
| [Filter Workflow](./architecture/workflows/FILTER_OPTIONS.md) | Dashboard filter orchestration and state update workflow. |
| [Pagination Workflow](./architecture/workflows/PAGINATION.md) | Pagination state handling and dashboard pagination workflow. |
| [Text Search Workflow](./architecture/workflows/TEXT_SEARCH_FILTER.md) | Dashboard search orchestration and reusable search workflow. |
| Documentation | Description |
| [Admin Create Form Workflow](./architecture/workflows/ADMIN_CREATEFORM_WORKFLOW.md) | main admin create form workflow |

# Features

## Buttons

| Documentation | Description |
|---|---|
| [Button Design System](./features/buttons/BUTTON_DESIGN_SYSTEM.md) | Shared button styling system and reusable button patterns. |
| [Create Button](./features/buttons/CREATE_BUTTON.md) | Dashboard create action button component. |
| [Open Filter Button](./features/buttons/OPEN_FILTER_BUTTON.md) | Button for opening dashboard filter panels. |
| [Pagination Button](./features/buttons/PAGINATION_BUTTON.md) | Shared pagination navigation button component. |
| [Reset Filter Button](./features/buttons/RESET_FILTER_BUTTON.md) | Button for resetting active dashboard filters. |
| [Delete Icon Button](./features/buttons/DELETE_ICON_BUTTON.md) | Button for deleting user choices |

## Dashboard

| Documentation | Description |
|---|---|
| [Dashboard Components](./features/dashboard/DASHBOARD_COMPONENTS.md) | Shared dashboard structure and reusable dashboard UI components. |

# Testing

| Documentation | Description |
|---|---|
| [Testing Overview](./tests/TESTING_OVERVIEW.md) | Central overview of frontend testing documentation and test coverage structure. |
