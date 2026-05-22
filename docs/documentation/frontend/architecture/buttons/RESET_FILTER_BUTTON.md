## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents
- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Default Props](#default-props)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Key Principle](#key-principle)

# ResetFiltersButton

## Purpose

`ResetFiltersButton` is a reusable button component used to reset active filtering workflows throughout the application.

It provides a consistent visual style for:
- resetting filter selections
- clearing active filter states
- restoring default filter configurations

The component is intentionally presentation-focused and does not contain business logic.

## Responsibilities

`ResetFiltersButton` is responsible for:

- displaying a themed reset button
- handling click interactions
- maintaining consistent reset action styling across the application

## What It Does Not Do

`ResetFiltersButton` does not:
- reset filters itself
- manage state
- clear search inputs
- know anything about filtering logic
- know which filters exist

Those responsibilities belong to orchestration components/pages.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `onClick` | function | Function triggered when the button is clicked |
| `children` | node | Custom button label/content |

## Default Props

| Prop | Default |
|---|---|
| `children` | `"Reset Filters"` |

## Usage Example

```jsx
<ResetFiltersButton
  onClick={resetActiveFilters}
/>
```

## Example Workflow

```text
User clicks ResetFiltersButton
    ↓
onClick handler executes
    ↓
page/component resets filter state
    ↓
default filter values restored
    ↓
filtered results refresh
```

## Key Principle

```text
ResetFiltersButton triggers reset actions.
Parent orchestration controls filter state.
```
