# FilterOptions

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Option Structure](#option-structure)
- [Active Filter Behaviour](#active-filter-behaviour)
- [Selection Behaviour](#selection-behaviour)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)

## Purpose

`FilterOptions` is a reusable filter selection component used to display selectable filter values throughout the application.

It provides a consistent filtering interface for:
- dashboard filtering
- resource filtering
- model filtering
- reusable filter workflows

The component visually displays selectable filter states using custom radio-style indicators.

## Responsibilities

`FilterOptions` is responsible for:

- rendering selectable filter options
- displaying active filter states
- triggering filter change events
- maintaining consistent filter option styling across the application

# What It Does Not Do

`FilterOptions` does not:
- manage filter state internally
- fetch data
- apply filters directly
- know anything about APIs or models
- store active selections

Those responsibilities belong to orchestration components/pages.

## Props

| Prop             | Type      | Purpose                                             |
|------------------|-----------|-----------------------------------------------------|
| `filterKey`      | string    | Identifier for the filter group                     |
| `options`        | array     | List of selectable filter options                   |
| `activeFilters`  | object    | Current active filter state object                  |
| `onFilterChange` | function  | Function triggered when a filter option is selected |

## Option Structure

Each option should follow this structure:

```js
{
  label: "Primary",
  value: "primary"
}
```

## Active Filter Behaviour

The component determines the active filter using:

```js
const activeValue = activeFilters[filterKey] ?? "all";
```

This:
- reads the current active filter value
- falls back to `"all"` when no value exists
- keeps filter states synchronized with orchestration state

## Selection Behaviour

When a filter option is clicked:

```js
onFilterChange(filterKey, option.value)
```

executes.

This:
- passes the filter key
- passes the selected value
- allows parent orchestration to update filter state

## Usage Example

```jsx
<FilterOptions
  filterKey="level"
  options={[
    { label: "All", value: "all" },
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
  ]}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
/>
```

## Example Workflow

```text
User clicks filter option
    ↓
onFilterChange executes
    ↓
parent filter state updates
    ↓
useCoreModelData dependencies change
    ↓
API refetch executes
    ↓
filtered results rerender
```
