# Pagination

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Global Pagination Configuration](#global-pagination-configuration)
- [Limit Offset Pagination](#limit-offset-pagination)
- [Example Request](#example-request)
- [Standard Paginated Response](#standard-paginated-response)
- [Response Fields](#response-fields)
- [Pagination Workflow](#pagination-workflow)
- [Pagination Philosophy](#pagination-philosophy)
- [Disabling Pagination](#disabling-pagination)
- [Pagination and Filtering](#pagination-and-filtering)

## Purpose

This document explains the pagination conventions currently used throughout the backend API.

Pagination is used to limit the number of records returned in list responses.

The backend currently uses Django REST Framework’s:

```py
LimitOffsetPagination
```

This pagination style works well with reusable frontend list pages and dashboard-style interfaces.

## Global Pagination Configuration

Pagination is configured globally in `REST_FRAMEWORK`.

```py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 20,
}
```

This means all paginated list views will use limit-offset pagination unless a view explicitly overrides it.

## Limit Offset Pagination

The backend uses:

```text
limit
offset
```

to control paginated responses.

| Parameter | Purpose |
|---|---|
| `limit` | Number of records to return |
| `offset` | Starting position within the queryset |

## Example Request

```text
/api/subjects/?limit=20&offset=0
```

This requests:

```text
first 20 records
starting from position 0
```

Next page example:

```text
/api/subjects/?limit=20&offset=20
```

This requests:

```text
next 20 records
starting from position 20
```

## Standard Paginated Response

Paginated responses follow this structure:

```json
{
  "count": 120,
  "next": "http://example.com/api/subjects/?limit=20&offset=20",
  "previous": null,
  "results": []
}
```

## Response Fields

| Field | Purpose |
|---|---|
| `count` | Total number of records available |
| `next` | URL for the next page |
| `previous` | URL for the previous page |
| `results` | Current page of serialized records |

## Pagination Workflow

```text
frontend sends limit and offset
    ↓
DRF applies pagination
    ↓
queryset is sliced
    ↓
serializer processes current page
    ↓
paginated response returns
```

Pagination happens after:

```text
filtering
search
queryset construction
```

This ensures pagination only applies to the final filtered queryset.

## Pagination Philosophy

The backend pagination system is designed to support:

```text
reusable frontend tables
dashboard list views
large datasets
consistent API responses
```

Using global pagination keeps pagination behaviour predictable across the API.

## Disabling Pagination

Some endpoints intentionally disable pagination.

Example:

```py
pagination_class = None
```

This is typically used for:

```text
small filter option lists
helper endpoints
lightweight related data
```

Example use case:

```text
subject filter dropdown options
```

These responses are expected to remain small enough that pagination is unnecessary.

## Pagination and Filtering

Pagination works alongside:

```text
search
filtering
ordering
```

Example request:

```text
/api/subjects/?search=math&level=secondary&limit=20&offset=0
```

Flow:

```text
queryset loads
    ↓
filters apply
    ↓
search applies
    ↓
pagination applies
    ↓
response returns current page
```
