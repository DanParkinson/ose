# coreModels

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Current Model Configuration](#current-model-configuration)
- [Endpoint Configuration](#endpoint-configuration)
- [Table Configuration](#table-configuration)
- [Filter Configuration](#filter-configuration)
- [Create Field Configuration](#create-field-configuration)
- [Update Field Configuration](#update-field-configuration)
- [Frontend Relationship](#frontend-relationship)

## Purpose

`coreModels` is the frontend configuration file that describes how reusable frontend systems should interact with core API models.

It allows dashboard tables, filters, forms, and API utilities to work from shared model configuration instead of hardcoded component logic.

## Current Model Configuration

The currently implemented model configuration is:

| ID | Title | Endpoint | Implemented |
|---|---|---|---|
| `subjects` | Subjects | `/core/subjects/` | :white_check_mark: |

## Endpoint Configuration

Each model defines its list and detail endpoints.

```js
endpoint: "/core/subjects/",
detailEndpoint: "/core/subjects/",
```

These endpoints are used by reusable API utility functions for:

```text
Fetching lists
Creating records
Updating records
Deleting records
```

## Table Configuration

Table configuration defines how model records are displayed in dashboard tables.

```js
columns: ["Subject", "Level", "Published", "Protected"],
templateColumns: "2fr 1fr 1fr 1fr",
keyField: "subject_id",
fields: ["title", "level", "is_published", "is_protected"],
```

| Property | Purpose |
|---|---|
| `columns` | Table headings |
| `templateColumns` | Grid layout for table columns |
| `keyField` | Unique identifier used for row rendering |
| `fields` | Record fields displayed in each row |

## Filter Configuration

Filters define which filter options are available for the model.

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

The `key` must match a backend query parameter supported by the API.

The special value:

```js
"all"
```

represents the default unfiltered state and is excluded from API query parameters.

## Create Field Configuration

`createFields` defines which fields are rendered by reusable create forms.

```js
createFields: [
  { name: "title", label: "Title", type: "text" },
  { name: "level", label: "Level", type: "choice" },
  { name: "language", label: "Language", type: "choice" },
  { name: "is_published", label: "Published", type: "boolean" },
  { name: "is_protected", label: "Protected", type: "boolean" },
]
```

These fields are consumed by the dynamic form system.

## Update Field Configuration

`updateFields` defines which fields are rendered by reusable update forms.

```js
updateFields: [
  { name: "title", label: "Title", type: "text" },
  { name: "level", label: "Level", type: "choice" },
  { name: "language", label: "Language", type: "choice" },
  { name: "is_published", label: "Published", type: "boolean" },
  { name: "is_protected", label: "Protected", type: "boolean" },
]
```

This allows update forms to use the same model-driven approach as create forms.

## Frontend Relationship

`coreModels` is consumed by reusable frontend systems including:

```text
Admin dashboard
Dashboard tables
Filter panels
Dynamic create forms
Dynamic update forms
Core API utilities
```

The model configuration acts as the contract between backend API resources and reusable frontend UI systems.