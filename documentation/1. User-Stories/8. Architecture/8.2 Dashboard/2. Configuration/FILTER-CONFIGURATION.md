# Filter Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Filter Configuration Exists](#why-filter-configuration-exists)
- [Filter Configuration Structure](#filter-configuration-structure)
- [Filter Groups](#filter-groups)
- [Filter Options](#filter-options)
- [Filter Keys](#filter-keys)
- [Relationship With DashboardFilterPanel](#relationship-with-dashboardfilterpanel)
- [Relationship With FilterOptions](#relationship-with-filteroptions)
- [Relationship With API Requests](#relationship-with-api-requests)
- [Example Configuration](#example-configuration)
- [Filter Workflow](#filter-workflow)

## Purpose

Filter configuration defines which filters are available for a model and how those filters should be displayed within the dashboard.

The dashboard does not contain model-specific filter logic.

Instead, filter definitions are supplied through the active model configuration.

## Why Filter Configuration Exists

Without filter configuration, every resource would require custom filter components.

Example:

```text
Subject Filters
Topic Filters
Lesson Filters
Resource Filters
```

would all require separate implementations.

Filter configuration allows a single filtering system to support multiple resources.

## Filter Configuration Structure

Filters are defined through the model's:

```js
filters
```

property.

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

Each filter object describes:

```text
Which backend field should be filtered
How the filter should be labelled
Which options are available
```

## Filter Groups

Each filter object becomes a filter group inside the dashboard.

Example:

```js
{
  key: "level",
  title: "By level",
  options: [...]
}
```

This generates a section within the filter panel.

Example:

```text
By level
    ○ All
    ○ Primary
    ○ Secondary
```

The dashboard creates these sections dynamically.

## Filter Options

Each filter contains a collection of selectable options.

Example:

```js
options: [
  { label: "All", value: "all" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
]
```

Each option contains:

| Property | Purpose |
|---|---|
| `label` | Displayed to the user |
| `value` | Sent to the filtering system |

The user interacts with labels while the dashboard works with values.

## Filter Keys

The filter key represents the backend field being filtered.

Example:

```js
key: "level"
```

The dashboard stores selected filter values using the filter key.

Example:

```js
{
  level: "secondary"
}
```

These values eventually become API query parameters.

## Relationship With DashboardFilterPanel

`DashboardFilterPanel` receives the filter configuration from the active model.

Example:

```jsx
<DashboardFilterPanel
  filters={selectedModel.filters}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
/>
```

The panel does not know which model is active.

It only renders the filter definitions it receives.

## Relationship With FilterOptions

Each filter group renders a reusable:

```text
FilterOptions
```

component.

The filter panel provides:

```text
filter key
available options
current active filters
change handler
```

while `FilterOptions` handles displaying and selecting options.

This keeps rendering logic separate from filter configuration.

## Relationship With API Requests

Filter configuration does not perform filtering directly.

Instead, selected filter values become part of:

```js
activeFilters
```

Example:

```js
{
  level: "secondary",
  is_published: true,
}
```

These values are passed into:

```js
useCoreModelData()
```

which then passes them into:

```js
fetchCoreModelList()
```

which finally converts them into API query parameters.

Example:

```text
GET /core/subjects/?level=secondary&is_published=true
```

The backend performs the actual filtering.

## Example Configuration

```js
filters: [
  {
    key: "level",
    title: "By level",
    options: [
      {
        label: "All",
        value: "all",
      },
      {
        label: "Primary",
        value: "primary",
      },
      {
        label: "Secondary",
        value: "secondary",
      },
    ],
  },
  {
    key: "is_published",
    title: "By published",
    options: [
      {
        label: "All",
        value: "all",
      },
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
  },
]
```

## Filter Workflow

```text
Dashboard loads selected model
        ↓
Filter configuration loaded
        ↓
DashboardFilterPanel renders
        ↓
Filter groups generated
        ↓
User selects filter option
        ↓
activeFilters updates
        ↓
useCoreModelData detects change
        ↓
fetchCoreModelList executes
        ↓
API request includes filter parameters
        ↓
Filtered rows returned
        ↓
Dashboard table rerenders
```

Filter configuration acts as the contract between dashboard filters and backend filtering functionality.