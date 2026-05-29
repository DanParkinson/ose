# Dashboard Workflow

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [What the Dashboard Orchestrates](#what-the-dashboard-orchestrates)
- [High-Level Workflow](#high-level-workflow)
- [Dashboard State](#dashboard-state)
- [Model Configuration Relationship](#model-configuration-relationship)
- [Data Loading Relationship](#data-loading-relationship)
- [Display Relationship](#display-relationship)
- [Search Relationship](#search-relationship)
- [Filter Relationship](#filter-relationship)
- [Pagination Relationship](#pagination-relationship)
- [Create Relationship](#create-relationship)
- [Update Relationship](#update-relationship)
- [Separation of Responsibilities](#separation-of-responsibilities)

## Purpose

The dashboard workflow coordinates all major dashboard systems.

The dashboard itself does not:

```text
Fetch API data
Render table values
Render filters
Build forms
Perform searching
Perform filtering
Perform pagination
```

Instead, it orchestrates these systems and connects them together.

The dashboard acts as the central coordination layer.

## What the Dashboard Orchestrates

The dashboard coordinates:

```text
Model selection
Data loading
Table rendering
Search
Filtering
Pagination
Create workflows
Update workflows
```

Each individual feature remains responsible for its own specialised behaviour.

## High-Level Workflow

```text
Dashboard loads
        ↓
Active model selected
        ↓
Model configuration loaded
        ↓
Data requested
        ↓
Rows returned
        ↓
Dashboard table rendered
        ↓
User interacts with search, filters, pagination, or forms
        ↓
Dashboard state updates
        ↓
Data reloads
        ↓
Dashboard rerenders
```

The dashboard coordinates the workflow but does not perform the individual operations itself.

## Dashboard State

The dashboard owns the primary orchestration state.

Typical examples include:

```text
Selected model
Search query
Active filters
Pagination offset
Selected row
Create panel state
Update panel state
```

These values are shared between multiple dashboard systems.

Because of this, they belong in the dashboard orchestration layer.

## Model Configuration Relationship

The dashboard begins by loading a model definition.

```text
Selected Model
        ↓
coreModels
        ↓
Active Configuration
```

The selected model determines:

```text
Which endpoint to load
Which columns to display
Which filters to display
Which forms to generate
```

The dashboard itself never hardcodes model-specific behaviour.

## Data Loading Relationship

The dashboard passes state into:

```js
useCoreModelData()
```

Example:

```js
useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

The hook manages:

```text
Loading
Rows
Count
Previous
Next
Errors
```

The dashboard only provides the required state.

## Display Relationship

The dashboard passes loaded rows into:

```text
DashboardTable
```

The table is responsible for:

```text
Displaying rows
Displaying headers
Displaying loading states
Displaying empty states
```

The dashboard only supplies the data.

## Search Relationship

The dashboard owns:

```js
searchInput
searchQuery
```

Search components update dashboard state.

Updated search values trigger:

```text
useCoreModelData
        ↓
API request
        ↓
Updated rows
```

The dashboard coordinates the workflow but does not perform searching itself.

## Filter Relationship

The dashboard owns:

```js
activeFilters
```

Filter components update filter state.

Updated filters trigger:

```text
useCoreModelData
        ↓
API request
        ↓
Updated rows
```

The dashboard coordinates filter state but does not apply filters itself.

## Pagination Relationship

The dashboard owns:

```js
offset
```

Pagination components trigger offset changes.

Updated offsets trigger:

```text
useCoreModelData
        ↓
API request
        ↓
Updated rows
```

The dashboard controls pagination state while the pagination component controls navigation UI.

## Create Relationship

The dashboard controls:

```text
Create panel visibility
Active create model
```

The dashboard decides:

```text
When create forms appear
Which model is being created
```

The dynamic form system handles:

```text
Field rendering
Validation
Submission
Success handling
```

## Update Relationship

The dashboard controls:

```text
Selected row
Update panel visibility
Active update model
```

The dashboard decides:

```text
Which record is being edited
When update forms appear
```

The dynamic form system handles:

```text
Field rendering
Validation
Update submission
Delete submission
```

## Separation of Responsibilities

### Dashboard

Responsible for:

```text
State orchestration
System coordination
Connecting components together
```

### Data Hooks

Responsible for:

```text
Loading API data
Managing loading state
Managing result state
```

### Dashboard Components

Responsible for:

```text
Displaying UI
Triggering actions
```

### Dynamic Forms

Responsible for:

```text
Creating records
Updating records
Deleting records
Validation handling
```

### Backend API

Responsible for:

```text
Searching
Filtering
Pagination
Validation
Data persistence
```

## Key Architectural Principle

```text
The dashboard coordinates the workflow.

Specialised systems perform the work.
```

This separation allows the dashboard system to remain reusable while individual features remain modular and easy to maintain.