# coreModels

## Navigation

[← Back to README.md](/README.md)

[← Back to DASHBOARD-SYSTEM.md](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard-System/DASHBOARD-SYSTEM.md)

## Table of Contents

- [Purpose](#purpose)
- [Role in the Dashboard System](#role-in-the-dashboard-system)
- [Configuration Object](#configuration-object)
- [Current Implementation](#current-implementation)
- [What coreModels Controls](#what-coremodels-controls)
- [What coreModels Does Not Do](#what-coremodels-does-not-do)
- [Example Configuration](#example-configuration)

## Purpose

`coreModels` is the shared configuration source for the dashboard system.

It defines which backend resources the dashboard can work with and how those resources should be displayed, filtered, searched, created, updated, and deleted.

The dashboard reads this configuration instead of hardcoding model-specific behaviour inside dashboard components.

## Role in the Dashboard System

`coreModels` acts as the contract between:

```text
backend API resources
dashboard tables
filters
search
pagination
dynamic forms
display renderers
```

The dashboard uses `coreModels` to decide:

```text
which model is currently selected
which endpoint should be requested
which table columns should render
which fields should display
which filters are available
which forms should be generated
```

## Configuration Object

Each model configuration object can define:

| Property | Purpose |
|---|---|
| `id` | Unique frontend identifier |
| `title` | Human-readable model name |
| `endpoint` | List/create API endpoint |
| `detailEndpoint` | Detail/update/delete API endpoint |
| `columns` | Table column headings |
| `templateColumns` | Table grid column layout |
| `keyField` | Unique identifier field from the backend |
| `fields` | Backend fields displayed in table rows |
| `filters` | Available dashboard filter groups |
| `createFields` | Fields used by create forms |
| `updateFields` | Fields used by update/delete forms |

## Current Implementation

The current implemented configuration is:

| Model | Endpoint | Key Field | Implemented |
|---|---|---|---|
| Subjects | `/core/subjects/` | `subject_id` | :white_check_mark: |

## What coreModels Controls

`coreModels` controls dashboard structure and behaviour.

It is used for:

```text
model selection
API endpoint selection
table rendering
row key generation
field display
filter rendering
create form generation
update form generation
```

This keeps the dashboard reusable because new resources can follow the same configuration structure.

## What coreModels Does Not Do

`coreModels` does not:

```text
fetch data
store dashboard state
submit forms
apply filters directly
render UI components
manage permissions
```

Those responsibilities belong to hooks, API utilities, forms, and dashboard orchestration components.

## Example Configuration

```js
const coreModels = [
  {
    id: "subjects",
    title: "Subjects",
    endpoint: "/core/subjects/",
    detailEndpoint: "/core/subjects/",

    columns: [
      "Subject",
      "Level",
      "Published",
      "Protected",
    ],

    templateColumns: "2fr 1fr 1fr 1fr",

    keyField: "subject_id",

    fields: [
      "title",
      "level",
      "is_published",
      "is_protected",
    ],

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
    ],

    createFields: [
      { name: "title", label: "Title", type: "text" },
      { name: "level", label: "Level", type: "choice" },
      { name: "language", label: "Language", type: "choice" },
      { name: "is_published", label: "Published", type: "boolean" },
      { name: "is_protected", label: "Protected", type: "boolean" },
    ],

    updateFields: [
      { name: "title", label: "Title", type: "text" },
      { name: "level", label: "Level", type: "choice" },
      { name: "language", label: "Language", type: "choice" },
      { name: "is_published", label: "Published", type: "boolean" },
      { name: "is_protected", label: "Protected", type: "boolean" },
    ],
  },
];

export default coreModels;
```