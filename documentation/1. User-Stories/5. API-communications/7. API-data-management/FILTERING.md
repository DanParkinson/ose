# Filtering

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Backend Filtering](#backend-filtering)
- [Frontend Filter Configuration](#frontend-filter-configuration)
- [Filter Query Parameters](#filter-query-parameters)
- [Filter Workflow](#filter-workflow)
- [Frontend Relationship](#frontend-relationship)

## Purpose

Filtering allows frontend requests to retrieve smaller, more relevant datasets from list endpoints.

The platform currently uses Django REST Framework filtering together with reusable frontend filter configuration.

## Backend Filtering

Filtering is enabled using:

```py
filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
]
```

Supported filter fields are declared using:

```py
filterset_fields = [
    "level",
    "language",
    "is_published",
    "is_protected",
]
```

The backend automatically applies matching query parameter filters to the queryset.

## Frontend Filter Configuration

Frontend filters are configured inside:

```js
coreModels
```

Example:

```js
filters: [
  {
    key: "level",
    title: "By level",
    options: [
      { label: "All", value: "all" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
    ],
  },
]
```

| Property | Purpose |
|---|---|
| `key` | Backend query parameter |
| `title` | UI filter title |
| `options` | Available filter values |

## Filter Query Parameters

Filters are converted into query parameters by:

```js
fetchCoreModelList
```

Example request:

```text
/core/subjects/?level=secondary
```

The special value:

```js
"all"
```

is ignored and excluded from the request.

```js
if (value !== "all") {
  params[key] = value;
}
```

This allows the frontend to represent an unfiltered state without sending unnecessary query parameters.

## Filter Workflow

```text
User selects filter option
    ↓
Parent filter state updates
    ↓
useCoreModelData dependencies change
    ↓
fetchCoreModelList executes
    ↓
API request sent with query parameters
    ↓
Backend filters queryset
    ↓
Filtered results returned
    ↓
Dashboard rerenders
```

## Frontend Relationship

Filtering currently works together with:

```text
coreModels
Filter panels
fetchCoreModelList
useCoreModelData
Dashboard tables
Pagination
```

Filtering and searching can be combined inside the same API request workflow.