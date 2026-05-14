## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents
- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Disabled Behaviour](#disabled-behaviour)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Styling Responsibility](#styling-responsibility)
- [Key Principle](#key-principle)

# PaginationButton

## Purpose

`PaginationButton` is a reusable button component used for pagination navigation throughout the application.

It provides a consistent interaction style for:
- previous page navigation
- next page navigation
- reusable pagination workflows

The component is intentionally lightweight and presentation-focused.

## Responsibilities

`PaginationButton` is responsible for:

- rendering pagination action buttons
- handling click interactions
- supporting disabled states
- maintaining consistent pagination button styling

## What It Does Not Do

`PaginationButton` does not:
- manage pagination state
- calculate pages
- update offsets
- fetch data
- know anything about APIs or datasets

Those responsibilities belong to orchestration components/pages.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `children` | node | Button label/content |
| `onClick` | function | Function triggered when the button is clicked |
| `disabled` | boolean | Controls whether the button is disabled |

## Disabled Behaviour

The component supports disabled navigation states.

Example:

```jsx
disabled={!next}
```

This prevents:
- invalid page navigation
- unnecessary requests
- incorrect pagination states

## Usage Example

```jsx
<PaginationButton
  disabled={!previous}
  onClick={handlePrevious}
>
  Previous
</PaginationButton>
```

## Example Workflow

```text
User clicks PaginationButton
    ↓
onClick handler executes
    ↓
pagination state updates
    ↓
data refetch executes
    ↓
new page renders
```

## Styling Responsibility

`PaginationButton` is intentionally minimal.

This allows:
- centralized button styling
- future theme expansion
- shared pagination behaviour
- reusable pagination workflows

Styling can later be expanded using:
- Chakra recipes
- reusable button variants
- semantic tokens

## Key Principle

```text
PaginationButton triggers navigation actions.
Parent orchestration controls pagination state.
```
