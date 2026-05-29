# FilterOptions

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why FilterOptions Exists](#why-filteroptions-exists)
- [Responsibilities](#responsibilities)
- [What FilterOptions Does Not Do](#what-filteroptions-does-not-do)
- [Props](#props)
- [Active Filter Value](#active-filter-value)
- [Option Rendering](#option-rendering)
- [Selection Handling](#selection-handling)
- [Relationship With DashboardFilterPanel](#relationship-with-dashboardfilterpanel)
- [Relationship With Dashboard State](#relationship-with-dashboard-state)
- [FilterOptions Workflow](#filteroptions-workflow)

## Purpose

`FilterOptions` renders the selectable options for a single dashboard filter group.

It displays the available options, highlights the active option, and reports user selections back to the parent dashboard workflow.

## Why FilterOptions Exists

Each filter group needs a reusable way to display selectable values.

Example:

```text
By level
    All
    Primary
    Secondary
```

Instead of hardcoding option rendering inside every filter panel, `FilterOptions` handles the repeated option display pattern.

## Responsibilities

`FilterOptions` is responsible for:

```text
Rendering filter options
Displaying active option state
Handling option clicks
Calling the filter change callback
```

## What FilterOptions Does Not Do

`FilterOptions` does not:

```text
Store filter state
Apply filters directly
Fetch data
Reset pagination
Build API query parameters
Know which model is active
```

Those responsibilities belong to the dashboard orchestration and data loading layers.

## Props

| Prop | Purpose |
|---|---|
| `filterKey` | Backend filter field key |
| `options` | Available filter options |
| `activeFilters` | Current active filter values |
| `onFilterChange` | Callback triggered when an option is selected |

Example:

```jsx
<FilterOptions
  filterKey={filter.key}
  options={filter.options}
  activeFilters={activeFilters}
  onFilterChange={onFilterChange}
/>
```

## Active Filter Value

The active value is read from `activeFilters`.

```js
const activeValue =
  activeFilters[filterKey] ?? "all";
```

If no active value exists, the component defaults to:

```js
"all"
```

This ensures the default option can appear active before the user selects another filter.

## Option Rendering

Each option is rendered from the provided options array.

Example option:

```js
{
  label: "Secondary",
  value: "secondary",
}
```

The component uses:

```js
option.label
```

for display and:

```js
option.value
```

for state updates.

The option value is converted to a string for the React key.

```js
key={String(option.value)}
```

This supports boolean values as well as string values.

## Selection Handling

When the user clicks an option, the component calls:

```js
onFilterChange(filterKey, option.value);
```

Example:

```js
onFilterChange("level", "secondary");
```

The component does not update state directly.

It reports the selected value to the parent dashboard workflow.

## Relationship With DashboardFilterPanel

`DashboardFilterPanel` renders one `FilterOptions` component for each filter group.

```jsx
<FilterOptions
  filterKey={filter.key}
  options={filter.options}
  activeFilters={activeFilters}
  onFilterChange={onFilterChange}
/>
```

The panel controls filter group structure.

`FilterOptions` controls option rendering and selection.

## Relationship With Dashboard State

The dashboard owns:

```js
activeFilters
```

When `FilterOptions` reports a selected value, the dashboard updates state.

Example:

```js
setActiveFilters((prev) => ({
  ...prev,
  [filterKey]: value,
}));
```

The dashboard also resets pagination after filter changes.

```js
setOffset(0);
```

This keeps filtering and pagination synchronised.

## FilterOptions Workflow

```text
DashboardFilterPanel renders filter group
        ↓
FilterOptions receives options
        ↓
Active value is read from activeFilters
        ↓
Options render with active styling
        ↓
User clicks an option
        ↓
onFilterChange runs
        ↓
Dashboard updates activeFilters
        ↓
Dashboard resets offset
        ↓
useCoreModelData refetches data
        ↓
Filtered results render
```

## Key Architectural Principle

```text
FilterOptions reports user intent.

Dashboard orchestration decides what happens next.
```

This keeps the option component reusable and independent from the API and dashboard state workflow.