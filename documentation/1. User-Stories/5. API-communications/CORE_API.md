# Core API

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Architecture Goal](#architecture-goal)

- [Core API Functions](#core-api-functions)
  - [`fetchCoreModelList`](#fetchcoremodellist)
    - [Parameters](#parameters)
    - [Query Construction](#query-construction)
    - [Filter Handling](#filter-handling)
    - [Example Request](#example-request)
    - [Example Generated URL](#example-generated-url)
    - [Response Example](#response-example)

  - [`fetchCoreModelOptions`](#fetchcoremodeloptions)
    - [Purpose](#purpose)
    - [Example Usage](#example-usage)
    - [Example Response](#example-response)
    - [Frontend Usage](#frontend-usage)

  - [`createCoreModelItem`](#createcoremodelitem)
    - [Parameters](#parameters-1)
    - [Example Usage](#example-usage-1)
    - [Request Flow](#request-flow)
    - [Validation Errors](#validation-errors)

- [Core API Workflow](#core-api-workflow)
  - [Example Dashboard Workflow](#example-dashboard-workflow)
  - [Example Create Workflow](#example-create-workflow)

- [Design Principles](#design-principles)
- [Usage Rules](#usage-rules)

## Purpose

The Core API layer provides reusable utility functions for interacting with reusable backend model endpoints.

It is designed to support dynamic frontend systems such as:

```text
Admin dashboards
Generic tables
Dynamic forms
Filtering systems
Search systems
Pagination workflows
Reusable CRUD interfaces
```

The Core API utilities centralise API communication logic so that components do not need to manually build requests.

## Architecture Goal

The Core API system is designed around reusable model-driven workflows.

Instead of creating separate frontend logic for every model:

```text
Subjects
Topics
Lesson Names
Teaching Styles
Variations
```

the frontend uses:

```text
Shared API utilities
Shared dashboard components
Shared hooks
Shared form rendering
Shared filtering logic
```

This allows new models to be integrated by configuration rather than rewriting frontend systems.

## Core API Functions

## `fetchCoreModelList`

Fetches paginated model data from a backend endpoint.

Supports:

```text
Pagination
Search
Filtering
```

### Function

```js
fetchCoreModelList({
  endpoint,
  limit,
  offset,
  searchQuery,
  filters,
})
```

### Parameters

| Parameter     | Description                     |
|----------------|---------------------------------|
| `endpoint`     | API endpoint to request         |
| `limit`        | Number of items to return       |
| `offset`       | Pagination offset               |
| `searchQuery`  | Search input value              |
| `filters`      | Object containing active filters |

### Query Construction

The function automatically builds query parameters.

Example:

```js
{
  limit: 20,
  offset: 0,
  search: "english",
  level: "secondary",
}
```

### Filter Handling

Filters using `"all"` are automatically excluded from the request.

```js
if (value !== "all") {
  params[key] = value;
}
```

This prevents unnecessary query parameters from being sent to the backend.

### Example Request

```js
await fetchCoreModelList({
  endpoint: "/core/subjects/",
  limit: 20,
  offset: 0,
  searchQuery: "math",
  filters: {
    level: "secondary",
    language: "en",
  },
});
```

### Example Generated URL

```text
/core/subjects/?limit=20&offset=0&search=math&level=secondary&language=en
```

### Response Example

```json
{
  "count": 42,
  "next": "http://localhost:8000/core/subjects/?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "subject_id": "uuid",
      "title": "Mathematics",
      "level": "secondary"
    }
  ]
}
```

## `fetchCoreModelOptions`

Fetches metadata about a model endpoint using the HTTP `OPTIONS` method.

This is primarily used for dynamic form generation.

### Function

```js
fetchCoreModelOptions({
  endpoint,
})
```

### Purpose

The backend `OPTIONS` response provides information such as:

```text
Available POST fields
Field types
Choice fields
Validation rules
Required fields
```

### Example Usage

```js
await fetchCoreModelOptions({
  endpoint: "/core/subjects/",
});
```

### Example Response

```json
{
  "actions": {
    "POST": {
      "level": {
        "type": "choice",
        "choices": [
          {
            "value": "primary",
            "display_name": "Primary"
          },
          {
            "value": "secondary",
            "display_name": "Secondary"
          }
        ]
      }
    }
  }
}
```

### Frontend Usage

The frontend uses this data to dynamically generate:

```text
Select dropdowns
Choice fields
Boolean fields
Dynamic form inputs
```

This removes the need to hardcode backend choices inside the frontend.

## `createCoreModelItem`

Creates a new item for a model endpoint.

### Function

```js
createCoreModelItem({
  endpoint,
  data,
})
```

### Parameters

| Parameter   | Description                |
|-------------|----------------------------|
| `endpoint`  | API endpoint to submit to  |
| `data`      | Form data payload          |

### Example Usage

```js
await createCoreModelItem({
  endpoint: "/core/subjects/",
  data: {
    title: "Mathematics",
    level: "secondary",
    language: "en",
    is_published: true,
  },
});
```

### Request Flow

```text
User submits form
    ↓
Frontend builds payload
    ↓
POST request sent to endpoint
    ↓
Backend validates request
    ↓
If valid:
    → item created
    → response returned
    ↓
If invalid:
    → validation errors returned
```

### Validation Errors

Validation errors are returned directly from DRF.

Example:

```json
{
  "title": [
    "This field may not be blank."
  ]
}
```

These errors are displayed inside the frontend form system.

## Core API Workflow

The Core API system is designed to power reusable frontend workflows.

## Example Dashboard Workflow

```text
AdminDashboard loads
    ↓
Selected model provides endpoint configuration
    ↓
useCoreModelData calls fetchCoreModelList()
    ↓
Backend returns paginated model data
    ↓
DashboardTable renders rows dynamically
    ↓
User applies filters/search
    ↓
fetchCoreModelList() rebuilds query params
    ↓
Updated results returned
```

## Example Create Workflow

```text
User clicks "+"
    ↓
SidePanel opens
    ↓
CoreModelCreateForm loads model contract
    ↓
fetchCoreModelOptions() loads backend metadata
    ↓
Dynamic fields are rendered
    ↓
User submits form
    ↓
createCoreModelItem() sends POST request
    ↓
Backend validates data
    ↓
Success:
    → panel closes
    → dashboard refetches data
```

## Design Principles

| Principle                | Description                                                |
|--------------------------|------------------------------------------------------------|
| Reusability              | Shared workflows used across all models                    |
| Configuration-driven     | Models are controlled by config objects                    |
| Backend-driven forms     | Frontend reads backend metadata dynamically                |
| Separation of concerns   | API logic separated from UI rendering                      |
| Scalability              | New models can be added with minimal frontend changes      |

## Usage Rules

- Use `fetchCoreModelList` for reusable paginated list fetching.
- Use `fetchCoreModelOptions` for dynamic form generation.
- Use `createCoreModelItem` for reusable create workflows.
- Keep endpoint configuration inside model contracts.
- Avoid hardcoding backend choices inside components.
- Keep API logic inside `coreApi.js`.
- Components should not manually construct query strings.

[↑ Back to Top](#core-api)
