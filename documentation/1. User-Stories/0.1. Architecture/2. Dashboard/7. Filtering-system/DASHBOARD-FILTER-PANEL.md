# DashboardFilterPanel

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why DashboardFilterPanel Exists](#why-dashboardfilterpanel-exists)
- [Responsibilities](#responsibilities)
- [What DashboardFilterPanel Does Not Do](#what-dashboardfilterpanel-does-not-do)
- [Props](#props)
- [Filter Group Rendering](#filter-group-rendering)
- [Relationship With Model Configuration](#relationship-with-model-configuration)
- [Relationship With FilterOptions](#relationship-with-filteroptions)
- [Relationship With Dashboard State](#relationship-with-dashboard-state)
- [Usage Example](#usage-example)
- [Filter Panel Workflow](#filter-panel-workflow)

## Purpose

`DashboardFilterPanel` is the reusable component responsible for displaying dashboard filter groups.

It renders filter sections dynamically using the filter configuration supplied by the currently selected model.

The component itself contains no model-specific logic.

## Why DashboardFilterPanel Exists

Different dashboard resources may require different filters.

Examples:

```text
Subjects
    ↓
Level
Language
Published

Topics
    ↓
Subject
Protected

Resources
    ↓
Type
Subject
Published
```

Rather than creating custom filter panels for every resource, the dashboard uses configuration-driven rendering.

This allows a single filter panel component to support multiple resource types.

## Responsibilities

`DashboardFilterPanel` is responsible for:

```text
Rendering filter groups
Rendering filter titles
Rendering filter options
Providing consistent filter layout
Passing filter actions to FilterOptions
```

## What DashboardFilterPanel Does Not Do

`DashboardFilterPanel` does not:

```text
Store filter state
Apply filters
Fetch data
Manage API requests
Know which model is active
```

Those responsibilities belong to:

```text
Dashboard orchestration
activeFilters state
useCoreModelData
fetchCoreModelList
```

## Props

| Prop | Purpose |
|---|---|
| `filters` | Filter definitions from the selected model |
| `activeFilters` | Current active filter values |
| `onFilterChange` | Updates filter state |

Example:

```jsx
<DashboardFilterPanel
  filters={selectedModel.filters}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
/>
```

## Filter Group Rendering

Each filter definition becomes a filter group.

Example:

```js
{
  key: "level",
  title: "By level",
  options: [...]
}
```

renders:

```text
By level
    ○ All
    ○ Primary
    ○ Secondary
```

Implementation:

```jsx
filters.map((filter) => (
  <Box key={filter.key}>
    ...
  </Box>
))
```

The component does not know which filters exist ahead of time.

Everything is generated dynamically from configuration.

## Relationship With Model Configuration

The filter panel receives:

```js
selectedModel.filters
```

from the active model.

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

This allows different resources to display completely different filter groups while using the same component.

## Relationship With FilterOptions

Each filter group renders:

```jsx
<FilterOptions
  filterKey={filter.key}
  options={filter.options}
  activeFilters={activeFilters}
  onFilterChange={onFilterChange}
/>
```

Responsibilities are split between:

### DashboardFilterPanel

```text
Renders filter sections
Displays filter titles
Passes filter data
```

### FilterOptions

```text
Displays selectable options
Determines active option styling
Handles option selection
```

This separation keeps the panel focused on structure rather than interaction.

## Relationship With Dashboard State

The panel does not own filter state.

The dashboard owns:

```js
activeFilters
```

The panel receives:

```js
activeFilters
```

and:

```js
onFilterChange
```

from the dashboard.

Workflow:

```text
User selects filter
        ↓
FilterOptions triggers callback
        ↓
Dashboard state updates
        ↓
useCoreModelData reruns
        ↓
Filtered data loads
```

## Usage Example

```jsx
<DashboardFilterPanel
  filters={selectedModel.filters}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
/>
```

The component remains reusable because it receives everything it needs through props.

## Filter Panel Workflow

```text
Dashboard loads selected model
        ↓
selectedModel.filters loaded
        ↓
DashboardFilterPanel receives filters
        ↓
Filter groups render
        ↓
FilterOptions render
        ↓
User selects filter option
        ↓
onFilterChange executes
        ↓
activeFilters updates
        ↓
useCoreModelData reruns
        ↓
Filtered rows returned
        ↓
Dashboard rerenders
```

## Key Architectural Principle

```text
DashboardFilterPanel decides WHERE filters are displayed.

FilterOptions decides HOW filters are selected.
```

This separation keeps the dashboard filtering system modular, reusable, and configuration-driven.