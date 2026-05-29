# Pagination

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Backend Pagination](#backend-pagination)
- [Frontend Pagination State](#frontend-pagination-state)
- [Pagination Requests](#pagination-requests)
- [Pagination Responses](#pagination-responses)
- [Pagination Workflow](#pagination-workflow)
- [Frontend Relationship](#frontend-relationship)

## Purpose

Pagination limits how many records are returned by list endpoints at one time.

The platform uses pagination to support reusable dashboard tables and scalable API list responses.

## Backend Pagination

The backend currently uses DRF limit-offset pagination.

Configuration:

```py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.LimitOffsetPagination",

    "PAGE_SIZE": 20,
}
```

This provides:

```text
count
next
previous
results
```

inside paginated API responses.

## Frontend Pagination State

The frontend currently manages pagination using:

```js
offset
limit
```

Example:

```js
fetchCoreModelList({
  endpoint,
  limit: 20,
  offset,
});
```

The frontend updates the offset value when moving between pages.

## Pagination Requests

Pagination values are sent as query parameters.

Example:

```text
/core/subjects/?limit=20&offset=0
```

| Parameter | Purpose |
|---|---|
| `limit` | Maximum number of records returned |
| `offset` | Starting position within the dataset |

## Pagination Responses

Paginated responses include:

```json
{
  "count": 45,
  "next": "...",
  "previous": null,
  "results": []
}
```

| Field | Purpose |
|---|---|
| `count` | Total available records |
| `next` | URL for next page |
| `previous` | URL for previous page |
| `results` | Current page records |

## Pagination Workflow

```text
Frontend updates offset
    ↓
API request sent with limit and offset
    ↓
Backend paginates queryset
    ↓
Paginated response returned
    ↓
useCoreModelData updates rows/count
    ↓
Dashboard rerenders
```

## Frontend Relationship

Pagination currently works together with:

```text
fetchCoreModelList
useCoreModelData
Pagination component
Dashboard tables
Text search filters
Filter panels
```

Search and filter changes typically reset pagination back to the first page.