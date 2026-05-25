# Filtering and Search

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [High-Level Flow](#high-level-flow)
- [Frontend Integration](#frontend-integration)
- [Standard Backend Configuration](#standard-backend-configuration)
  - [Exact Filtering](#exact-filtering)
  - [Search Configuration](#search-configuration)
- [Current Filtering Strategy](#current-filtering-strategy)
- [Combined Filtering and Search](#combined-filtering-and-search)
- [Relationship Filtering](#relationship-filtering)
- [Filtering Philosophy](#filtering-philosophy)
- [Search Philosophy](#search-philosophy)
- [Pagination Integration](#pagination-integration)
- [Current Architecture Principle](#current-architecture-principle)

## Purpose

This document explains the filtering and search conventions currently used throughout the backend API.

Filtering and search are designed to support reusable frontend list pages and dashboard-style interfaces.

The current implementation is primarily used by standard `ListCreateAPIView` endpoints.

## High-Level Flow

```text
Frontend sends query parameters
    ↓
DRF view receives request
    ↓
Filter backends process filters and search
    ↓
Queryset is filtered
    ↓
Serialized response is returned
    ↓
Frontend updates displayed data
```

Filtering and search are designed to work alongside reusable frontend API helpers.

## Frontend Integration

The frontend communicates with list endpoints using reusable API helper functions.

Example:

```js
fetchCoreModelList({
  endpoint,
  limit,
  offset,
  searchQuery,
  filters,
})
```

The frontend converts active filters into query parameters.

Example:

```text
?level=secondary
?language=en
?is_published=true
?search=math
```

The backend automatically applies these values through DRF filtering and search backends.

## Standard Backend Configuration

List views should generally use:

```py
filter_backends = [DjangoFilterBackend, filters.SearchFilter]
```

This enables:

| Backend | Purpose |
|---|---|
| `DjangoFilterBackend` | Exact field filtering |
| `SearchFilter` | Text-based search |

# Exact Filtering

Exact filtering is configured using:

```py
filterset_fields = []
```

Example:

```py
filterset_fields = [
    "level",
    "language",
    "is_published",
    "is_protected",
]
```

This allows requests such as:

```text
?level=secondary
?language=en
?is_published=true
```

The backend automatically filters the queryset using these values.

## Search Configuration

Search fields are configured using:

```py
search_fields = []
```

Example:

```py
search_fields = ["title"]
```

This allows requests such as:

```text
?search=math
```

The backend performs text matching against the configured search fields.

## Current Filtering Strategy

The current backend filtering strategy focuses on:

```text
simple reusable filters
frontend-controlled query parameters
DRF-managed filtering
minimal custom filtering logic
```

Most list endpoints currently use:

```text
filterset_fields
search_fields
```

instead of complex custom filter classes.

## Combined Filtering and Search

Filtering and search can be combined in the same request.

Example:

```text
?level=secondary&is_published=true&search=math
```

Flow:

```text
exact filters apply first
    ↓
search filtering applies
    ↓
final queryset is returned
```

This allows the frontend to build flexible reusable filtering interfaces.

## Relationship Filtering

Some list views filter using related fields.

Example:

```py
filterset_fields = [
    "subjects",
]
```

This allows filtering by related object identifiers.

Example request:

```text
?subjects=<subject_uuid>
```

This is commonly used for:

```text
many-to-many relationships
foreign key relationships
```

## Filtering Philosophy

The current filtering approach focuses on:

```text
predictable query parameters
reusable frontend logic
simple DRF configuration
minimal duplicated backend logic
```

The backend is designed so most filtering behaviour can be declared directly on the view.

## Search Philosophy

The current search approach focuses on:

```text
simple keyword searching
frontend-driven search state
lightweight DRF configuration
```

Search is intended for:

```text
dashboard search inputs
quick resource lookup
basic text matching
```

## Pagination Integration

Filtering and search work alongside pagination.

Example request:

```text
?limit=20&offset=20&search=math&level=secondary
```

Flow:

```text
filters apply
    ↓
search applies
    ↓
pagination applies
    ↓
response returns current page
```

This allows the frontend to maintain reusable pagination behaviour while filtering and searching data.

## Current Architecture Principle

```text
The frontend controls filter state and query parameters.

The backend receives query parameters and applies filtering/search behaviour through reusable DRF filter backends.
```
