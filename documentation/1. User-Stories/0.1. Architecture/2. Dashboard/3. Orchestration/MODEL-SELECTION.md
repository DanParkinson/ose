# Model Selection

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Model Selection Exists](#why-model-selection-exists)
- [Selected Model State](#selected-model-state)
- [Relationship With coreModels](#relationship-with-coremodels)
- [Active Model](#active-model)
- [What Changes When a Model Changes](#what-changes-when-a-model-changes)
- [Dashboard System Relationship](#dashboard-system-relationship)
- [Model Selection Workflow](#model-selection-workflow)

## Purpose

Model selection determines which resource the dashboard is currently working with.

The dashboard system is designed to support multiple resources through a shared architecture.

Rather than hardcoding dashboard behaviour for individual resources, the dashboard selects a model definition and builds the interface from configuration.

## Why Model Selection Exists

The dashboard system is configuration-driven.

Without model selection, the dashboard would need separate implementations for every resource.

Example:

```text
Subject Dashboard
Topic Dashboard
Lesson Dashboard
Resource Dashboard
```

Model selection allows a single dashboard implementation to support multiple resources.

## Selected Model State

The dashboard stores the currently active model.

Example:

```js
const [selectedModel, setSelectedModel] =
  useState(coreModels[0]);
```

This state acts as the starting point for the rest of the dashboard workflow.

## Relationship With coreModels

The dashboard does not create model definitions itself.

Instead, it loads them from:

```js
coreModels
```

Example:

```js
const selectedModel =
  coreModels.find(
    (model) => model.id === selectedModelId
  );
```

The selected model becomes the active configuration object used throughout the dashboard.

## Active Model

Once selected, the active model provides:

```text
API endpoints
Table configuration
Filter configuration
Form configuration
Primary key information
```

Example:

```text
Selected Model
        ↓
endpoint
columns
fields
filters
createFields
updateFields
```

The rest of the dashboard reads from the active model configuration.

## What Changes When a Model Changes

When a new model becomes active, the dashboard automatically changes:

```text
Data source
Table structure
Filters
Create form fields
Update form fields
```

The dashboard itself does not need to know the details of the resource being displayed.

It simply reacts to the new configuration.

## Dashboard System Relationship

Model selection influences every major dashboard system.

### Data Loading

```text
selectedModel.endpoint
        ↓
useCoreModelData
```

### Table Rendering

```text
selectedModel.columns
selectedModel.fields
selectedModel.templateColumns
        ↓
DashboardTable
```

### Filtering

```text
selectedModel.filters
        ↓
DashboardFilterPanel
```

### Form Generation

```text
selectedModel.createFields
selectedModel.updateFields
        ↓
Dynamic Forms
```

Because of this, model selection sits near the beginning of the dashboard workflow.

## Model Selection Workflow

```text
Dashboard loads
        ↓
Model selected
        ↓
Active model configuration loaded
        ↓
Endpoint selected
        ↓
Data loaded
        ↓
Table configuration loaded
        ↓
Filters loaded
        ↓
Forms configured
        ↓
Dashboard rendered
```

## Key Architectural Principle

```text
The dashboard does not select behaviour.

The selected model configuration selects behaviour.
```

This allows the dashboard system to remain reusable while supporting multiple resource types through configuration.