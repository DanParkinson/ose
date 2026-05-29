# Model Definitions

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [What Is a Model Definition](#what-is-a-model-definition)
- [Why Model Definitions Exist](#why-model-definitions-exist)
- [Model Identity](#model-identity)
- [API Endpoints](#api-endpoints)
- [Primary Identifier](#primary-identifier)
- [Display Configuration](#display-configuration)
- [Filter Configuration](#filter-configuration)
- [Form Configuration](#form-configuration)
- [Model Definition Workflow](#model-definition-workflow)

## Purpose

A model definition describes a single backend resource that can be managed by the dashboard system.

Each model definition acts as a contract between:

```text
Backend API
Dashboard System
Dynamic Forms
Display Components
```

The dashboard does not know anything about individual models.

Instead, it reads model definitions from `coreModels`.

## What Is a Model Definition

A model definition is a configuration object inside the `coreModels` array.

Example:

```js
{
  id: "subjects",
  title: "Subjects",
  endpoint: "/core/subjects/",
  detailEndpoint: "/core/subjects/",
}
```

Each definition describes how the dashboard should work with a specific resource.

## Why Model Definitions Exist

Without model definitions, every dashboard feature would need to be hardcoded.

Example:

```text
Subject Table
Subject Filters
Subject Forms
Subject API Requests
```

would all require separate implementations.

Model definitions allow the dashboard to become resource-driven instead.

The dashboard reads configuration and adapts automatically.

## Model Identity

Every model definition requires an identifier.

```js
id: "subjects"
```

The identifier is used internally by the dashboard when selecting and managing models.

The identifier should be unique across all model definitions.

A human-readable title is also required.

```js
title: "Subjects"
```

This title is displayed throughout the dashboard interface.

## API Endpoints

Each model definition provides the API endpoints required by the dashboard.

### List/Create Endpoint

```js
endpoint: "/core/subjects/"
```

Used for:

```text
Loading table data
Searching
Filtering
Pagination
Creating records
```

### Detail Endpoint

```js
detailEndpoint: "/core/subjects/"
```

Used for:

```text
Updating records
Deleting records
```

The dashboard never hardcodes endpoint URLs.

Everything comes from the model definition.

## Primary Identifier

Every model requires a unique identifier field.

```js
keyField: "subject_id"
```

The dashboard uses this value when:

```text
Generating row keys
Opening update forms
Submitting updates
Submitting deletes
Selecting rows
```

The dashboard never assumes the identifier is named `id`.

## Display Configuration

Model definitions define how records appear inside dashboard tables.

Example:

```js
columns: [
  "Subject",
  "Level",
  "Published",
  "Protected",
]

fields: [
  "title",
  "level",
  "is_published",
  "is_protected",
]
```

The dashboard uses:

```text
columns
```

to build table headers.

The dashboard uses:

```text
fields
```

to determine which values should be rendered for each row.

## Filter Configuration

Model definitions define which filters are available.

Example:

```js
filters: [
  {
    key: "level",
    title: "By level",
    options: [...]
  }
]
```

This allows the filter panel to be generated dynamically.

The dashboard does not need model-specific filter components.

## Form Configuration

Model definitions define which fields are available in generated forms.

Example:

```js
createFields
updateFields
```

These definitions are consumed by the dynamic form system.

This allows create and update forms to be generated automatically.

The dashboard only decides:

```text
When forms appear
Which model is active
```

The dynamic form system decides:

```text
How forms are built
How fields render
How submissions work
```

## Model Definition Workflow

```text
Dashboard loads
        ↓
coreModels loaded
        ↓
User selects model
        ↓
Model definition becomes active
        ↓
Dashboard reads endpoint
        ↓
Dashboard loads data
        ↓
Dashboard reads table configuration
        ↓
Table renders
        ↓
Dashboard reads filter configuration
        ↓
Filters render
        ↓
Dashboard reads form configuration
        ↓
Create and update forms become available
```

The model definition acts as the central configuration object that connects the dashboard system to backend resources.